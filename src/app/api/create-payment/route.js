import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const donorData = await request.json();

    // ✅ Validate fields
    if (!donorData.name || !donorData.phone || !donorData.amount) {
      return NextResponse.json(
        { success: false, message: "Validation failed" },
        { status: 400 }
      );
    }

    if (donorData.amount < 10) {
      return NextResponse.json(
        { success: false, message: "Minimum donation is ₹10" },
        { status: 400 }
      );
    }

    // ✅ Generate Transaction ID
    const transactionId = `TRX-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: donorData.phone,
      name: donorData.name,
      amount: donorData.amount * 100, // paise
      redirectUrl: process.env.PHONEPE_REDIRECT_URL,
      redirectMode: "REDIRECT",
      callbackUrl: process.env.PHONEPE_CALLBACK_URL,
      paymentInstrument: { type: "PAY_PAGE" },
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

    // ✅ Correct checksum formula
    const endpoint = "/pg/v1/pay";
    const raw = base64Payload + endpoint + process.env.PHONEPE_SALT_KEY;

    const checksum =
      crypto.createHash("sha256").update(raw).digest("hex") +
      "###" +
      process.env.PHONEPE_SALT_INDEX;

    // ✅ PhonePe API Call
    const response = await fetch(`${process.env.PHONEPE_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID,
      },
      body: JSON.stringify({ request: base64Payload }),
    });

    const result = await response.json();
    console.log("📡 PHONEPE RESPONSE =>", result);

    if (result?.success && result?.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({
        success: true,
        transactionId,
        paymentUrl: result.data.instrumentResponse.redirectInfo.url,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: result?.message || "PhonePe payment init failed",
        error: result,
      },
      { status: 400 }
    );
  } catch (err) {
    console.error("❌ PHONEPE INIT ERROR =>", err);
    return NextResponse.json(
      { success: false, message: "Server Error", error: err.message },
      { status: 500 }
    );
  }
}
