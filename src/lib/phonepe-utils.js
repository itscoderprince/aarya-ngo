import crypto from "crypto"

export const PHONEPE_CONFIG = {
  BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://api.phonepe.com/apis/hermes"
      : "https://api-preprod.phonepe.com/apis/pg-sandbox",
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID,
  SALT_KEY: process.env.PHONEPE_SALT_KEY,
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX || 1,
}

// ✅ Create unique merchant transaction ID
export function generateTransactionId() {
  return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 8)}`
}

// ✅ Generate X-VERIFY checksum
export function generateChecksum(payload, endpoint) {
  const checksumString = payload + endpoint + PHONEPE_CONFIG.SALT_KEY
  const sha256 = crypto.createHash("sha256").update(checksumString).digest("hex")
  return `${sha256}###${PHONEPE_CONFIG.SALT_INDEX}`
}

// ✅ Create PhonePe payment request Body
export function createPaymentPayload(donorDetails, transactionId) {
  const { name, phone, email, amount } = donorDetails

  const payload = {
    merchantId: PHONEPE_CONFIG.MERCHANT_ID,
    merchantTransactionId: transactionId,
    amount: Number(amount) * 100,
    merchantUserId: `USER_${Date.now()}`,
    redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/donate-success?txnId=${transactionId}`,
    redirectMode: "POST",
    callbackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment-callback`,
    mobileNumber: phone,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
    metadata: {
      donorName: name,
      donorEmail: email,
    },
  }

  return payload
}

// ✅ Verify status
export async function verifyPaymentStatus(transactionId) {
  try {
    const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.MERCHANT_ID}/${transactionId}`
    const checksum = generateChecksum("", endpoint)

    const res = await fetch(`${PHONEPE_CONFIG.BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": PHONEPE_CONFIG.MERCHANT_ID,
      },
    })

    const data = await res.json()
    return data
  } catch (err) {
    console.error("PhonePe status error:", err)
    return { success: false, message: "PhonePe API error" }
  }
}

// ✅ Validate input
export function validateDonationData(data) {
  const { name, email, phone, amount } = data
  const errors = []

  if (!name || name.trim().length < 2)
    errors.push("Name must be at least 2 characters")
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push("Enter a valid email")
  if (!phone || !/^[6-9]\d{9}$/.test(phone))
    errors.push("Enter valid 10-digit phone")
  if (!amount || amount < 1)
    errors.push("Minimum donation is ₹1")
  if (amount > 1000000)
    errors.push("Max donation allowed is ₹10,00,000")

  return { isValid: errors.length === 0, errors }
}

// ✅ Format Rupee
export function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount)
}

// ✅ Generate Donation Receipt No.
export function generateReceiptNumber() {
  const d = new Date()
  return `PBAF${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(
    d.getDate()
  ).padStart(2, "0")}${Math.random().toString(36).substring(2, 8).toUpperCase()}`
}
