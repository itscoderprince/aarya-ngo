import { NextResponse } from "next/server";
import {
  createPaymentPayload,
  generateTransactionId,
  generateChecksum,
  validateDonationData,
  PHONEPE_CONFIG,
} from "../../../lib/phonepe-utils";

export async function POST(request) {
  try {
    const donorData = await request.json();

    // ✅ Validate user donation info
    const validation = validateDonationData(donorData);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: validation.errors },
        { status: 400 }
      );
    }

    // ✅ Create transaction reference
    const transactionId = generateTransactionId();
    donorData.transactionId = transactionId;

    // ✅ Save donation in memory (temporary)
    global.pendingDonations = global.pendingDonations || {};
    global.pendingDonations[transactionId] = {
      ...donorData,
      status: "pending",
      createdAt: Date.now(),
    };

    // ✅ Prepare PhonePe payload
    const paymentPayload = createPaymentPayload(donorData, transactionId);
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString("base64");

    // ✅ Correct checksum
    const endpoint = "/pg/v1/pay";
    const checksum = generateChecksum(base64Payload, endpoint);

    // ✅ Request to PhonePe
    const response = await fetch(`${PHONEPE_CONFIG.BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": PHONEPE_CONFIG.MERCHANT_ID, // ✅ Mandatory header
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const result = await response.json();
    console.log("📡 PHONEPE CREATE PAYMENT RESPONSE =>", JSON.stringify(result, null, 2));

    // ✅ Success — return redirect URL
    if (result?.success && result?.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({
        success: true,
        paymentUrl: result.data.instrumentResponse.redirectInfo.url,
        transactionId,
      });
    }

    // ❌ Failed — show error
    return NextResponse.json(
      {
        success: false,
        message: result?.message || "PhonePe payment init failed",
        error: result,
      },
      { status: 400 }
    );

  } catch (err) {
    console.error("❌ PHONEPE API ERROR =>", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}
