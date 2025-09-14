import { NextResponse } from "next/server"
import {
  createPaymentPayload,
  generateTransactionId,
  generateChecksum,
  validateDonationData,
  PHONEPE_CONFIG,
} from "../../../lib/phonepe-utils"

export async function POST(request) {
  try {
    const donorData = await request.json()

    // ✅ Validate input
    const validation = validateDonationData(donorData)
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: validation.errors },
        { status: 400 }
      )
    }

    // ✅ Generate unique transaction ID
    const transactionId = generateTransactionId()

    // ✅ Create payload
    const paymentPayload = createPaymentPayload(donorData, transactionId)
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString("base64")

    // ✅ Generate checksum
    const checksum = generateChecksum(base64Payload, "/pg/v1/pay")

    // ✅ Make request to PhonePe
    const response = await fetch(`${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": PHONEPE_CONFIG.MERCHANT_ID, // 🔥 required
      },
      body: JSON.stringify({ request: base64Payload }),
    })

    const responseData = await response.json()
    console.log("📡 PhonePe Raw Response:", responseData)

    if (responseData.success) {
      global.pendingDonations = global.pendingDonations || {}
      global.pendingDonations[transactionId] = {
        ...donorData,
        timestamp: Date.now(),
        status: "pending",
      }

      return NextResponse.json({
        success: true,
        paymentUrl: responseData.data.instrumentResponse.redirectInfo.url,
        transactionId,
      })
    } else {
      return NextResponse.json(
        { success: false, message: "Payment initiation failed", phonepeError: responseData },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 })
  }
}
