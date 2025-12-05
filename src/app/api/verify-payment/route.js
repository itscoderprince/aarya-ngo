import { connectDB } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Volunteer from "@/models/Volunteer";
import { checkPhonePeStatus } from "@/lib/phonepe/payment";
import { generateReceiptNumber } from "@/lib/generateReceiptNumber";
import { generateIDCardPDF, generateCertificatePDF, generateReceiptPDF } from "@/lib/pdf-generator";
import { sendVolunteerEmail, sendVolunteerAdminEmail, sendDonorEmail, sendAdminEmail } from "@/lib/sendDonationEmail";
import { apiHandler, successResponse, errorResponse } from "@/lib/api-utils";

// ⛔ Prevent PhonePe calls during Vercel build
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

export const POST = apiHandler(async (req) => {
  const { transactionId } = await req.json();

  if (!transactionId) {
    return errorResponse("Transaction ID is required", 400);
  }

  console.log(`[VERIFY] Processing: ${transactionId}`);

  // 🚫 Skip verification entirely during build
  if (isBuildTime) {
    return successResponse({
      buildWarning: true,
      message: "Skipped PhonePe verify API during build phase.",
      transactionId,
      status: "build_phase_skip"
    });
  }

  await connectDB();

  // 1. Check Payment Status (runtime only)
  const paymentStatus = await checkPhonePeStatus(transactionId);
  const state = paymentStatus?.state || "FAILED";
  const isSuccess = state === "COMPLETED" || state === "PAYMENT_SUCCESS";
  const amount = paymentStatus?.amount ? paymentStatus.amount / 100 : 0;

  // 2. Identify Type
  const isVolunteer = transactionId.startsWith("VOL_PAY");
  let record = isVolunteer
    ? await Volunteer.findOne({ merchantOrderId: transactionId })
    : await Donation.findOne({ merchantOrderId: transactionId });

  if (!record) {
    return errorResponse("Record not found", 404);
  }

  // 3. Update Record
  if (isVolunteer) {
    // Volunteer Update
    record.paymentDetails = {
      transactionId,
      state,
      amount: amount || record.amount,
      fullResponse: paymentStatus?.raw || {},
    };

    if (amount > 0) record.amount = amount;

    if (!isSuccess) {
      record.status = "payment_failed";
    }

    await record.save();

    // 4. Volunteer Post-Success (Emails + PDFs)
    if (isSuccess) {
      try {
        const [idCardBuffer, certificateBuffer] = await Promise.all([
          generateIDCardPDF(record),
          generateCertificatePDF(record)
        ]);

        await Promise.all([
          sendVolunteerEmail(record, idCardBuffer, certificateBuffer),
          sendVolunteerAdminEmail(record)
        ]);

        console.log(`[VERIFY] Volunteer emails sent for ${transactionId}`);
      } catch (err) {
        console.error(`[VERIFY] Volunteer Post-Action Error: ${err.message}`);
      }
    }

  } else {
    // Donation Update
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

    if (isSuccess) {
      try {
        // Generate Receipt PDF
        const pdfBuffer = await generateReceiptPDF(record);

        // Send Emails (Donor + Admin)
        await Promise.all([
          sendDonorEmail(record, null, pdfBuffer),
          sendAdminEmail(record, null)
        ]);

        console.log(`[VERIFY] Donation emails sent for ${transactionId}`);
      } catch (err) {
        console.error(`[VERIFY] Donation Post-Action Error: ${err.message}`);
      }
    } else if (!record.receiptPdfUrl) {
      console.log(`[VERIFY] Donation receipt generation skipped for ${transactionId} (Payment Failed)`);
    }
  }

  return successResponse(record, 200);
});
