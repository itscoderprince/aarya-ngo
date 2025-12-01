import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Donation from "@/models/Donation";
import Volunteer from "@/models/Volunteer";

import { checkPhonePeStatus } from "@/lib/phonepe/payment";
import { generateReceiptNumber } from "@/lib/generateReceiptNumber";
import { generateReceiptPDF, generateIDCardPDF, generateCertificatePDF } from "@/lib/pdf-generator";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { sendDonorEmail, sendAdminEmail, sendVolunteerEmail, sendVolunteerAdminEmail } from "@/lib/sendDonationEmail";

export async function POST(req) {
  try {
    const { transactionId } = await req.json();
    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: "transactionId required" },
        { status: 400 }
      );
    }

    console.log("🔍 Verifying payment for transaction:", transactionId);

    await connectDB();

    // 1. DETERMINE TYPE BASED ON PREFIX
    const isVolunteer = transactionId.startsWith("VOL_PAY");

    if (isVolunteer) {
      // ==========================================
      // VOLUNTEER VERIFICATION LOGIC
      // ==========================================
      let volunteer = await Volunteer.findOne({ merchantOrderId: transactionId });
      if (!volunteer) {
        return NextResponse.json({ success: false, message: "Volunteer application not found" }, { status: 404 });
      }

      // Check Status with PhonePe
      const result = await checkPhonePeStatus(transactionId);
      const state = result?.state || "FAILED";
      const isSuccess = state === "COMPLETED" || state === "PAYMENT_SUCCESS";

      console.log(`📊 Volunteer Payment State: ${state}`);

      // Update DB - Save Payment Details
      volunteer.paymentDetails = {
        transactionId: transactionId,
        state: state,
        amount: result.amount,
        paymentInstrument: result.raw?.data?.paymentInstrument,
        fullResponse: result.raw || {}
      };
      volunteer.markModified('paymentDetails'); // Ensure Mixed type is saved

      if (isSuccess) {
        // volunteer.status = "PAYMENT_SUCCESS"; // REMOVED: Keep status as 'pending' for admin approval
        if (!volunteer.amount && result.amount) {
          volunteer.amount = result.amount / 100;
        }
      } else {
        volunteer.status = "PAYMENT_FAILED";
      }

      await volunteer.save();
      console.log(`✅ Volunteer payment verified. Status remains: ${volunteer.status}`);

      // Send Emails if Success
      if (isSuccess) {
        try {
          console.log("📄 Generating Volunteer Artifacts...");
          const idCardBuffer = await generateIDCardPDF(volunteer);
          const certificateBuffer = await generateCertificatePDF(volunteer);

          // Send Welcome Email
          await sendVolunteerEmail(volunteer, idCardBuffer, certificateBuffer);

          // Notify Admin
          await sendVolunteerAdminEmail(volunteer);

          console.log("✅ Volunteer emails sent.");
        } catch (emailError) {
          console.error("❌ Volunteer Email Error:", emailError);
        }
      }

      return NextResponse.json({
        success: true,
        data: volunteer,
        message: "Volunteer payment verified"
      });

    } else {
      // ==========================================
      // DONATION VERIFICATION LOGIC
      // ==========================================
      let donation = await Donation.findOne({ merchantOrderId: transactionId });
      if (!donation) {
        return NextResponse.json({ success: false, message: "Donation not found" }, { status: 404 });
      }

      // Check Status with PhonePe
      const result = await checkPhonePeStatus(transactionId);
      const state = result?.state || "FAILED";
      const isSuccess = state === "COMPLETED" || state === "PAYMENT_SUCCESS";

      console.log(`📊 Donation Payment State: ${state}`);

      // Update DB
      donation.status = isSuccess ? "PAYMENT_SUCCESS" : "PAYMENT_FAILED";
      donation.paymentInfo = {
        transactionId: transactionId,
        state: state,
        amount: result.amount,
        paymentInstrument: result.raw?.data?.paymentInstrument,
        fullResponse: result.raw || {}
      };
      donation.markModified('paymentInfo');

      await donation.save();
      console.log(`✅ Donation status updated to: ${donation.status}`);

      if (!isSuccess) {
        return NextResponse.json({
          success: true,
          data: donation,
          message: "Payment verification completed but payment not successful"
        });
      }

      // Prevent duplicate processing
      if (donation.receiptPdfUrl) {
        return NextResponse.json({
          success: true,
          message: "Already processed",
          data: donation,
        });
      }

      // Generate Receipt
      donation.receiptNumber = donation.receiptNumber || generateReceiptNumber();

      console.log("📄 Generating Donation Receipt PDF...");
      const pdfBuffer = await generateReceiptPDF({
        merchantOrderId: transactionId,
        donorName: donation.donorName,
        donorEmail: donation.donorEmail,
        donorPhone: donation.donorPhone,
        amount: donation.amount,
        createdAt: donation.createdAt,
      });

      // Upload to Cloudinary
      const upload = await uploadToCloudinary(
        pdfBuffer,
        "aarya-ngo/receipts",
        `receipt_${donation.receiptNumber}`
      );

      donation.receiptPdfUrl = upload.secure_url;
      await donation.save();

      // Send Emails
      if (donation.donorEmail) {
        sendDonorEmail(donation, upload.secure_url, pdfBuffer).catch(e => console.error(e));
      }
      sendAdminEmail(donation, upload.secure_url).catch(e => console.error(e));

      return NextResponse.json({
        success: true,
        data: donation,
        message: "Donation verified successfully"
      });
    }

  } catch (err) {
    console.error("❌ VERIFY ERROR:", err.message);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
