import { NextResponse } from "next/server"
import { verifyPaymentStatus } from "../../../lib/phonepe-utils"

export async function POST(request) {
  try {
    const { transactionId } = await request.json()

    if (!transactionId) {
      return NextResponse.json(
        {
          success: false,
          message: "Transaction ID is required",
        },
        { status: 400 },
      )
    }

    // Verify payment status with PhonePe
    const paymentStatus = await verifyPaymentStatus(transactionId)

    // Get stored donor details
    const donorDetails = global.pendingDonations?.[transactionId]

    return NextResponse.json({
      success: paymentStatus.success,
      data: paymentStatus.data,
      code: paymentStatus.code,
      message: paymentStatus.message,
      donorDetails: donorDetails || null,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Payment verification failed",
      },
      { status: 500 },
    )
  }
}
