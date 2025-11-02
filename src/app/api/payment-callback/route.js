import { NextResponse } from "next/server";
import crypto from "crypto";
import { PHONEPE_CONFIG } from "../../../lib/phonepe-utils";

export async function POST(request) {
  try {
    const body = await request.json();
    const encryptedResponse = body.response;
    const xVerifyHeader = body["X-VERIFY"] || body["x-verify"];

    if (!encryptedResponse) {
      return NextResponse.json(
        { success: false, message: "Invalid PhonePe payload" },
        { status: 400 }
      );
    }

    // ✅ Decode PhonePe Base64 response
    const decodedResponse = Buffer.from(encryptedResponse, "base64").toString("utf-8");
    const responseData = JSON.parse(decodedResponse);

    const txnId = responseData.merchantTransactionId;
    const merchantId = responseData.merchantId;
    const code = responseData.code;

    // ✅ Checksum validation (Correct format)
    const checksumString = encryptedResponse + `/pg/v1/status/${merchantId}/${txnId}` + PHONEPE_CONFIG.SALT_KEY;

    const calculatedChecksum =
      crypto.createHash("sha256").update(checksumString).digest("hex") +
      "###" +
      PHONEPE_CONFIG.SALT_INDEX;

    if (!xVerifyHeader || calculatedChecksum !== xVerifyHeader) {
      console.error("❌ PhonePe callback checksum mismatch");
      return NextResponse.json(
        { success: false, message: "Checksum mismatch" },
        { status: 401 }
      );
    }

    // ✅ Access pending donation
    global.pendingDonations = global.pendingDonations || {};
    const donorDetails = global.pendingDonations[txnId] || null;

    console.log("✅ PhonePe Callback Received:", { txnId, code });

    // ✅ Payment Success
    if (code === "PAYMENT_SUCCESS") {
      if (donorDetails) {
        donorDetails.status = "completed";
        donorDetails.completedAt = Date.now();
      }

      // ✅ Send email notification
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/send-donation-emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorDetails,
          transactionDetails: {
            transactionId: txnId,
            status: "Successful",
            paymentMethod: responseData?.data?.paymentInstrument?.type || "PhonePe",
            amount: responseData.amount / 100,
          },
        }),
      }).catch(() => console.warn("Email send failed in callback"));

      // cleanup after 24 hrs
      setTimeout(() => delete global.pendingDonations[txnId], 24 * 60 * 60 * 1000);
    }

    // ❌ Payment Failed / Declined
    if (code !== "PAYMENT_SUCCESS") {
      if (donorDetails) {
        donorDetails.status = "failed";
        donorDetails.failedAt = Date.now();
        donorDetails.failureReason = responseData.message;
      }
    }

    return NextResponse.json({ success: true, message: "Callback received" });
  } catch (error) {
    console.error("🔥 PhonePe callback error:", error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
