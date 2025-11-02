import { NextResponse } from "next/server";
import { verifyPaymentStatus } from "../../../lib/phonepe-utils";

export async function POST(request) {
  try {
    const { transactionId } = await request.json();

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: "Transaction ID is required" },
        { status: 400 }
      );
    }

    // ✅ Verify payment on PhonePe
    const paymentStatus = await verifyPaymentStatus(transactionId);

    const code = paymentStatus.code; // PAYMENT_SUCCESS / PAYMENT_ERROR / PENDING
    const donorDetails = global.pendingDonations?.[transactionId] || null;

    // ✅ Update local store status
    if (code === "PAYMENT_SUCCESS" && donorDetails) {
      donorDetails.status = "completed";
      donorDetails.completedAt = Date.now();

      // auto cleanup
      setTimeout(() => {
        delete global.pendingDonations[transactionId];
      }, 86400000);
    }

    if ((code === "PAYMENT_ERROR" || code === "PAYMENT_DECLINED") && donorDetails) {
      donorDetails.status = "failed";
      donorDetails.failedAt = Date.now();
      donorDetails.failureReason = paymentStatus.message;
    }

    return NextResponse.json({
      success: paymentStatus.success ?? false,
      status: code,
      message: paymentStatus.message,
      data: paymentStatus.data || null,
      donorDetails,
    });
  } catch (error) {
    console.error("❌ Payment verification error:", error);

    return NextResponse.json(
      { success: false, message: "Payment verification failed", error: error.message },
      { status: 500 }
    );
  }
}
