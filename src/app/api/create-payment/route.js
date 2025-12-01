import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { createPhonePeOrder } from "@/lib/phonepe/payment";
import Donation from "@/models/Donation";
import Volunteer from "@/models/Volunteer";
import { uploadToCloudinary } from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let data = {};
    let profilePicUrl = null;
    let paymentReceiptUrl = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Extract text fields
      for (const [key, value] of formData.entries()) {
        if (typeof value === "string") {
          data[key] = value;
        }
      }

      // Handle File Uploads
      const profilePic = formData.get("profilePic");
      const receipt = formData.get("receipt");

      if (profilePic && profilePic instanceof File) {
        const upload = await uploadToCloudinary(profilePic, "volunteers/profiles");
        profilePicUrl = upload.secure_url;
      }

      if (receipt && receipt instanceof File) {
        const upload = await uploadToCloudinary(receipt, "volunteers/receipts");
        paymentReceiptUrl = upload.secure_url;
      }

      // Normalize keys
      if (!data.mobile && data.phone) data.mobile = data.phone;
      if (!data.referralId && data.referral) data.referralId = data.referral;

    } else {
      data = await req.json();
    }

    await connectDB();

    // 1. DETERMINE TYPE & PREFIX
    // Default to 'donation' if type is missing
    const isVolunteer = data.paymentType === "volunteer" || data.paymentType === "VOLUNTEER";
    const prefix = isVolunteer ? "VOL_PAY" : "DON_PAY";

    // Generate Unique Order ID with Prefix (e.g., VOL_PAY_1234...)
    const merchantOrderId = `${prefix}_${randomUUID()}`;
    const amount = Math.round(parseFloat(data.amount) * 100); // Convert to Paise (Integer)

    // 3. PROCESS PAYMENT OR FREE ENTRY
    if (amount > 0) {
      // --- PAID FLOW ---

      // SET REDIRECT URL
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
      const successPage = isVolunteer ? "/volunteer-conformation" : "/donate-success";
      const redirectUrl = `${baseUrl}${successPage}?merchantOrderId=${merchantOrderId}`;

      // INITIATE PHONEPE ORDER
      const payment = await createPhonePeOrder({
        orderId: merchantOrderId,
        amount,
        redirectUrl,
        meta: { ...data, merchantOrderId },
      });

      console.log(`[${isVolunteer ? "VOLUNTEER" : "DONATION"}] Payment initiated:`, merchantOrderId);

      // SAVE TO DB (PENDING STATUS)
      // SAVE TO DB (PENDING STATUS)
      if (isVolunteer) {
        await Volunteer.create({
          merchantOrderId,
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          dob: new Date(data.dob),
          bloodGroup: data.bloodGroup,
          address: data.address,
          volunteerType: data.validity,
          referralCode: data.referralId || null,
          amount: data.amount,
          status: "PENDING",
          paymentDetails: payment,
          profilePicUrl,
          paymentReceiptUrl,
          paymentReference: data.paymentReference || null,
        });
      } else {
        await Donation.create({
          merchantOrderId,
          donorName: data.name,
          donorEmail: data.email,
          donorPhone: data.phone || data.mobile,
          pan: data.pan,
          amount: data.amount,
          status: "PENDING",
          receiptNumber: null,
        });
      }

      return NextResponse.json(payment);

    } else {
      // --- FREE FLOW (Admin / Free Plan) ---
      console.log(`[VOLUNTEER] Free entry created:`, merchantOrderId);

      if (isVolunteer) {
        await Volunteer.create({
          merchantOrderId,
          name: data.name,
          email: data.email,
          mobile: data.mobile,
          dob: new Date(data.dob),
          bloodGroup: data.bloodGroup,
          address: data.address,
          volunteerType: "free", // Force type to free if amount is 0
          referralCode: data.referralId || null,
          amount: 0,
          status: "PENDING", // Still pending admin approval if needed, or could be 'approved'
          paymentDetails: { status: "FREE_ENTRY" },
          profilePicUrl,
          paymentReceiptUrl: null,
          paymentReference: data.paymentReference || null,
        });
      } else {
        // Donations shouldn't be 0, but handle safely
        return NextResponse.json({ success: false, message: "Donation amount must be greater than 0" }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: "Application submitted successfully",
        isFree: true
      });
    }

  } catch (error) {
    console.error("Payment API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}