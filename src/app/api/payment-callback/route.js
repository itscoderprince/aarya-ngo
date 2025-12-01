import { connectDB } from "@/lib/mongodb";
import { validatePhonePeCallback } from "@/lib/phonepe/payment";
import Donation from "@/models/Donation";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const bodyString = await req.text();
    const auth = req.headers.get("authorization");

    const validation = await validatePhonePeCallback({
      username: process.env.PHONEPE_CALLBACK_USER,
      password: process.env.PHONEPE_CALLBACK_PASS,
      authorization: auth,
      responseBodyString: bodyString
    });

    if (!validation.success) {
      return NextResponse.json({ success: false, message: "Invalid callback" });
    }

    const { payload } = validation.data;
    const orderId = payload.originalMerchantOrderId;
    const state = payload.state;

    await connectDB();

    const donation = await Donation.findOne({ merchantOrderId: orderId });
    donation.status = state === "COMPLETED" ? "PAYMENT_SUCCESS" : state;
    donation.paymentInfo = payload;

    await donation.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
