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

    // Validate donation data
    const validation = validateDonationData(donorData)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 },
      )
    }

    // Generate unique transaction ID
    const transactionId = generateTransactionId()

    // Create payment payload
    const paymentPayload = createPaymentPayload(donorData, transactionId)

    // Create base64 encoded payload
    const base64Payload = Buffer.from(JSON.stringify(paymentPayload)).toString("base64")

    // Create checksum
    const checksum = generateChecksum(base64Payload, "/pg/v1/pay")

    // Make request to PhonePe
    const response = await fetch(`${PHONEPE_CONFIG.BASE_URL}/pg/v1/pay`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
      },
      body: JSON.stringify({
        request: base64Payload,
      }),
    })

    const responseData = await response.json()

    if (responseData.success) {
      // Store donor details temporarily (in production, use a proper database)
      global.pendingDonations = global.pendingDonations || {}
      global.pendingDonations[transactionId] = {
        ...donorData,
        timestamp: Date.now(),
        status: "pending",
      }

      return NextResponse.json({
        success: true,
        paymentUrl: responseData.data.instrumentResponse.redirectInfo.url,
        transactionId: transactionId,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: "Payment initiation failed",
          error: responseData.message,
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("Payment creation error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 },
    )
  }
}
