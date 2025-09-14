import { NextResponse } from "next/server"
import crypto from "crypto"
import { PHONEPE_CONFIG } from "../../../lib/phonepe-utils"

export async function POST(request) {
  try {
    const body = await request.json()
    const { response } = body

    // Decode the response
    const decodedResponse = Buffer.from(response, "base64").toString("utf-8")
    const responseData = JSON.parse(decodedResponse)

    // Verify checksum for security
    const checksumString =
      response +
      "/pg/v1/status/" +
      responseData.merchantId +
      "/" +
      responseData.merchantTransactionId +
      PHONEPE_CONFIG.SALT_KEY
    const expectedChecksum =
      crypto.createHash("sha256").update(checksumString).digest("hex") + "###" + PHONEPE_CONFIG.SALT_INDEX

    if (responseData.code === "PAYMENT_SUCCESS") {
      const donorDetails = global.pendingDonations?.[responseData.merchantTransactionId]

      if (donorDetails) {
        // Update status
        donorDetails.status = "completed"
        donorDetails.completedAt = Date.now()

        // Send emails using the email API
        try {
          const emailResponse = await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/send-donation-emails`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                donorDetails,
                transactionDetails: {
                  transactionId: responseData.merchantTransactionId,
                  status: "Successful",
                  paymentMethod: responseData.data?.paymentInstrument?.type || "PhonePe",
                  amount: responseData.amount / 100,
                },
              }),
            },
          )

          if (!emailResponse.ok) {
            console.error("Failed to send emails")
          }

          // Clean up after successful processing
          setTimeout(
            () => {
              delete global.pendingDonations[responseData.merchantTransactionId]
            },
            24 * 60 * 60 * 1000,
          ) // Keep for 24 hours for reference
        } catch (emailError) {
          console.error("Email sending error:", emailError)
        }
      }
    } else if (responseData.code === "PAYMENT_ERROR" || responseData.code === "PAYMENT_DECLINED") {
      // Update status for failed payments
      const donorDetails = global.pendingDonations?.[responseData.merchantTransactionId]
      if (donorDetails) {
        donorDetails.status = "failed"
        donorDetails.failedAt = Date.now()
        donorDetails.failureReason = responseData.message
      }
    }

    return NextResponse.json({
      success: true,
      message: "Callback processed successfully",
    })
  } catch (error) {
    console.error("Payment callback error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Callback processing failed",
      },
      { status: 500 },
    )
  }
}
