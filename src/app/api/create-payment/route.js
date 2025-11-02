import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(request) {
  try {
    const donor = await request.json();

    if (!donor.name || !donor.phone || !donor.amount) {
      return NextResponse.json({ success: false, message: "Invalid input" }, { status: 400 });
    }

    if (donor.amount < 10) {
      return NextResponse.json({ success: false, message: "Minimum donation ₹10" }, { status: 400 });
    }

    const transactionId = `PRAYAS_${Date.now()}`;

    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId: transactionId,
      merchantUserId: donor.phone,
      amount: donor.amount * 100,
      redirectUrl: `${process.env.PHONEPE_REDIRECT_URL}?transactionId=${transactionId}`,
      redirectMode: "REDIRECT",
      callbackUrl: process.env.PHONEPE_CALLBACK_URL,
      paymentInstrument: { type: "PAY_PAGE" }
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64");

    const endpoint = "/pg/v1/pay";
    const stringToHash = base64Payload + endpoint + process.env.PHONEPE_SALT_KEY;

    const sha256 = crypto.createHash("sha256").update(stringToHash).digest("hex");
    const checksum = `${sha256}###${process.env.PHONEPE_SALT_INDEX}`;

    const response = await fetch(`${process.env.PHONEPE_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": process.env.PHONEPE_MERCHANT_ID
      },
      body: JSON.stringify({ request: base64Payload })
    });

    const result = await response.json();
    console.log("📡 PHONEPE API =>", result);

    if (result?.success && result?.data?.instrumentResponse?.redirectInfo?.url) {
      return NextResponse.json({
        success: true,
        transactionId,
        paymentUrl: result.data.instrumentResponse.redirectInfo.url
      });
    }

    return NextResponse.json({ success: false, error: result }, { status: 400 });

  } catch (error) {
    console.error("❌ ERROR:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
