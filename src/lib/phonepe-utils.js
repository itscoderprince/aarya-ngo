import crypto from "crypto"

// 🔐 PhonePe configuration
export const PHONEPE_CONFIG = {
  BASE_URL:
    process.env.NODE_ENV === "production"
      ? "https://api.phonepe.com/apis/hermes" // Production
      : "https://api-preprod.phonepe.com/apis/pg-sandbox", // Sandbox
  MERCHANT_ID: process.env.PHONEPE_MERCHANT_ID || "SU2509101240319707979509",
  SALT_KEY: process.env.PHONEPE_SALT_KEY || "1e7df590-7ae7-45a5-ad27-7a661ae902dc",
  SALT_INDEX: process.env.PHONEPE_SALT_INDEX || 1,
}

// ✅ Generate checksum for PhonePe API requests
export function generateChecksum(payload, endpoint) {
  const checksumString = payload + endpoint + PHONEPE_CONFIG.SALT_KEY
  return (
    crypto.createHash("sha256").update(checksumString).digest("hex") +
    "###" +
    PHONEPE_CONFIG.SALT_INDEX
  )
}

// ✅ Generate unique transaction ID
export function generateTransactionId() {
  return `TXN_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

// ✅ Create payment payload for PhonePe
export function createPaymentPayload(donorDetails, transactionId) {
  const { phone, amount, name, email } = donorDetails

  return {
    merchantId: PHONEPE_CONFIG.MERCHANT_ID,
    merchantTransactionId: transactionId,
    merchantUserId: `USER_${Date.now()}`,
    amount: amount * 100, // Convert ₹ to paise
    redirectUrl: `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/donate-success?txnId=${transactionId}`,
    redirectMode: "POST",
    callbackUrl: `${
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    }/api/payment-callback`,
    mobileNumber: phone,
    paymentInstrument: {
      type: "PAY_PAGE",
    },
    // Optional metadata for records
    metadata: {
      donorName: name,
      donorEmail: email,
    },
  }
}

// ✅ Verify payment status with PhonePe
export async function verifyPaymentStatus(transactionId) {
  try {
    const endpoint = `/pg/v1/status/${PHONEPE_CONFIG.MERCHANT_ID}/${transactionId}`
    const checksum = generateChecksum("", endpoint)

    const response = await fetch(`${PHONEPE_CONFIG.BASE_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-VERIFY": checksum,
        "X-MERCHANT-ID": PHONEPE_CONFIG.MERCHANT_ID,
      },
    })

    return await response.json()
  } catch (error) {
    console.error("Payment verification error:", error)
    throw error
  }
}

// ✅ Validate donation form data
export function validateDonationData(data) {
  const { name, email, phone, amount } = data
  const errors = []

  if (!name || name.trim().length < 2) {
    errors.push("Name must be at least 2 characters long")
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Please enter a valid email address")
  }

  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    errors.push("Please enter a valid 10-digit mobile number")
  }

  if (!amount || amount < 1) {
    errors.push("Donation amount must be at least ₹1")
  }

  if (amount > 1000000) {
    errors.push("Donation amount cannot exceed ₹10,00,000")
  }

  return {
    isValid: errors.length === 0,
    errors,
  }
}

// ✅ Format amount for display
export function formatAmount(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// ✅ Generate receipt number
export function generateReceiptNumber() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const random = Math.random().toString(36).slice(2, 8).toUpperCase()

  return `PBAF${year}${month}${day}${random}`
}
