import { connectDB } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Volunteer from "@/models/Volunteer";
import { checkPhonePeStatus } from "@/lib/phonepe/payment";
import { generateReceiptNumber } from "@/lib/generateReceiptNumber";
import { generateIDCardPDF, generateCertificatePDF } from "@/lib/pdf-generator";
import { sendVolunteerEmail, sendVolunteerAdminEmail } from "@/lib/sendDonationEmail";
import { apiHandler, successResponse, errorResponse } from "@/lib/api-utils";

export const POST = apiHandler(async (req) => {
  const { transactionId } = await req.json();

  if (!transactionId) {
    return errorResponse("Transaction ID is required", 400);
  }

  console.log(`[VERIFY] Processing: ${transactionId}`);
  await connectDB();

  // 1. Check Payment Status with PhonePe
  const paymentStatus = await checkPhonePeStatus(transactionId);
  const state = paymentStatus?.state || "FAILED";
  const isSuccess = state === "COMPLETED" || state === "PAYMENT_SUCCESS";
  const amount = paymentStatus?.amount ? paymentStatus.amount / 100 : 0;

  // 2. Identify Type & Fetch Record
  const isVolunteer = transactionId.startsWith("VOL_PAY");
  let record = isVolunteer
    ? await Volunteer.findOne({ merchantOrderId: transactionId })
    : await Donation.findOne({ merchantOrderId: transactionId });

  if (!record) {
    return errorResponse("Record not found", 404);
  }

  // 3. Update Record
  if (isVolunteer) {
    // --- VOLUNTEER UPDATE ---
    record.paymentDetails = {
      transactionId,
      state,
      amount: amount || record.amount,
      fullResponse: paymentStatus?.raw || {},
    };

    // Update amount if confirmed from gateway
    if (amount > 0) record.amount = amount;

    // Status Logic: 
    // If success, keep 'pending' for admin approval. 
    // If failed, mark 'payment_failed'.
    if (!isSuccess) {
      record.status = "payment_failed";
    }

    await record.save();

    // 4. Post-Success Actions (Emails/PDFs)
    if (isSuccess) {
      try {
        // Generate PDFs in parallel
        const [idCardBuffer, certificateBuffer] = await Promise.all([
          generateIDCardPDF(record),
          generateCertificatePDF(record)
        ]);

        // Send Emails in parallel
        await Promise.all([
          sendVolunteerEmail(record, idCardBuffer, certificateBuffer),
          sendVolunteerAdminEmail(record)
        ]);

        console.log(`[VERIFY] Volunteer emails sent for ${transactionId}`);
      } catch (err) {
        console.error(`[VERIFY] Volunteer Post-Action Error: ${err.message}`);
        // Don't fail the request if emails fail
      }
    }

  } else {
    // --- DONATION UPDATE ---
    record.status = isSuccess ? "payment_success" : "payment_failed";
    record.paymentInfo = {
      transactionId,
      state,
      amount: amount || record.amount,
      fullResponse: paymentStatus?.raw || {},
    };

    if (isSuccess && !record.receiptNumber) {
      record.receiptNumber = generateReceiptNumber();
    }

    await record.save();

    if (isSuccess && !record.receiptPdfUrl) {
      try {
        // Placeholder for receipt generation
        console.log(`[VERIFY] Donation receipt generation skipped for ${transactionId}`);
      } catch (err) {
        console.error(`[VERIFY] Donation Post-Action Error: ${err.message}`);
      }
    }
  }

  return successResponse(record, 200);
});
