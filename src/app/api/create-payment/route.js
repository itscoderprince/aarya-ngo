import { randomUUID } from "crypto";
import { connectDB } from "@/lib/mongodb";
import { createPhonePeOrder } from "@/lib/phonepe/payment";
import Donation from "@/models/Donation";
import Volunteer from "@/models/Volunteer";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { apiHandler, successResponse, errorResponse } from "@/lib/api-utils";

// Configuration
const VALIDITY_PRICES = {
  "1year": 501,
  "3year": 1100,
  "lifetime": 5100,
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export const POST = apiHandler(async (req) => {
  await connectDB();

  const contentType = req.headers.get("content-type") || "";
  let data = {};
  let profilePicUrl = null;
  let uploadResult = null;

  // 1. Parse Input
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();

    // Extract fields
    for (const [key, value] of formData.entries()) {
      if (typeof value === "string") data[key] = value;
    }

    // Handle File Upload
    const profilePic = formData.get("profilePic");
    if (profilePic instanceof File) {
      uploadResult = await uploadToCloudinary(profilePic, "volunteers/profiles");
      profilePicUrl = uploadResult.secure_url;
    }
  } else {
    data = await req.json();
  }

  // Normalize Data
  const isVolunteer = data.paymentType?.toUpperCase() === "VOLUNTEER";
  const phone = data.phone || data.mobile;
  const referral = data.referral || data.referralId;

  // 2. Calculate & Validate Amount
  let amountToPay = parseFloat(data.amount);

  if (isVolunteer) {
    // Server-side price enforcement for volunteers
    if (data.validity && VALIDITY_PRICES[data.validity]) {
      amountToPay = VALIDITY_PRICES[data.validity];
    }
  }

  const amountInPaise = Math.round(amountToPay * 100);

  if (!amountInPaise || amountInPaise <= 0) {
    return errorResponse("Invalid amount. Amount must be greater than 0.", 400);
  }

  // 3. Prepare Order Details
  const prefix = isVolunteer ? "VOL_PAY" : "DON_PAY";
  const merchantOrderId = `${prefix}_${randomUUID()}`;
  const successPage = isVolunteer ? "/volunteer-conformation" : "/donate-success";
  const redirectUrl = `${BASE_URL}${successPage}?merchantOrderId=${merchantOrderId}`;

  // 4. Initiate PhonePe Payment
  const paymentResponse = await createPhonePeOrder({
    orderId: merchantOrderId,
    amount: amountInPaise,
    redirectUrl,
    meta: { ...data, merchantOrderId },
  });

  console.log(`[PAYMENT_INIT] Type: ${isVolunteer ? "VOLUNTEER" : "DONATION"}, OrderID: ${merchantOrderId}`);

  // 5. Save Initial Record (Pending State)
  if (isVolunteer) {
    await Volunteer.create({
      merchantOrderId,
      name: data.name,
      email: data.email,
      mobile: phone,
      dob: data.dob ? new Date(data.dob) : null,
      bloodGroup: data.bloodGroup,
      address: data.address,
      volunteerType: data.validity,
      validity: data.validity, // Backward compatibility
      referralCode: referral || null,
      amount: amountToPay,
      status: "pending",
      paymentDetails: paymentResponse,
      profilePicUrl: profilePicUrl,
      profilePicCloudinaryId: uploadResult?.public_id || null,
    });
  } else {
    await Donation.create({
      merchantOrderId,
      donorName: data.name,
      donorEmail: data.email,
      donorPhone: phone,
      pan: data.pan,
      amount: amountToPay,
      status: "pending",
      paymentInfo: paymentResponse,
    });
  }

  return successResponse(paymentResponse);
});