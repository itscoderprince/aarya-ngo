import crypto from "crypto";

export async function POST(req) {
  try {
    const payload = await req.text(); 
    const receivedSignature = req.headers.get("x-verify");

    const salt = process.env.PHONEPE_SALT_KEY;
    const base64Payload = Buffer.from(payload).toString("base64");
    const calculatedSignature = crypto
      .createHash("sha256")
      .update(base64Payload + salt)
      .digest("hex");

    if (receivedSignature !== `${calculatedSignature}###${process.env.PHONEPE_SALT_INDEX}`) {
      console.log("❌ Invalid webhook signature");
      return new Response("Invalid Signature", { status: 401 });
    }

    const data = JSON.parse(payload);
    console.log("✅ PhonePe Webhook Received:", data);

    // TODO: Save to DB or mark payment as success

    return new Response("OK", { status: 200 });

  } catch (error) {
    console.error("Webhook Error:", error);
    return new Response("Error", { status: 500 });
  }
}
