import { connectDB } from "@/lib/mongodb";
import Volunteer from "@/models/Volunteer";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { sendConfirmationEmail, sendApprovalEmail } from "@/lib/mailer";
import { verifyToken } from "@/middleware/adminAuth";
import { apiHandler, successResponse, errorResponse } from "@/lib/api-utils";

const VALIDITY_PRICES = {
  "1year": 501,
  "3year": 1100,
  lifetime: 5100,
  "free": 0,
};

// Helper to check admin status
function checkAdmin(req) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return false;
  return verifyToken(token); // Returns payload or null
}

export const GET = apiHandler(async (req) => {
  await connectDB();
  const { searchParams } = new URL(req.url);

  // Single ID Fetch
  const volunteerId = searchParams.get("volunteerId");
  if (volunteerId) {
    const volunteer = await Volunteer.findOne({ volunteerId }).lean();
    if (!volunteer) return errorResponse("Volunteer not found", 404);
    return successResponse(volunteer);
  }

  // Pagination & Filtering
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "all";
  const validity = searchParams.get("validity") || "all";
  const mode = searchParams.get("mode"); // 'public' or 'admin'

  const query = {};

  // Public Mode: Strict Filtering
  if (mode === "public") {
    query.status = "approved";
    query.isPublished = true;
  }

  // Search Logic
  if (search) {
    const searchRegex = { $regex: search, $options: "i" };
    query.$or = [
      { name: searchRegex },
      { email: searchRegex },
      { mobile: searchRegex },
      { volunteerId: searchRegex },
    ];
  }

  // Filters (Admin can override, but Public is strict)
  if (mode !== "public") {
    if (status !== "all") query.status = status;
    if (validity !== "all") query.validity = validity;
  } else {
    // Public can optionally filter by validity (plan) if needed, but status is locked
    if (validity !== "all") query.validity = validity;
  }

  // If 'all' flag is NOT set, we might default to approved/published (legacy behavior), 
  // BUT for admin table we usually want everything unless filtered.
  // The previous code had: if (all) return all; else return approved & published.
  // We will assume if pagination params are present, we are in "Admin Table Mode" and want everything matching filters.
  // If no params and not 'all', we might fallback to legacy public behavior, but let's stick to Admin needs here.

  // Calculate Skip
  const skip = (page - 1) * limit;

  // Fetch Data
  const [volunteers, total] = await Promise.all([
    Volunteer.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Volunteer.countDocuments(query),
  ]);

  return successResponse({
    volunteers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const POST = apiHandler(async (req) => {
  const isAdminUser = checkAdmin(req);
  await connectDB();

  const formData = await req.formData();

  const name = formData.get("name");
  const email = formData.get("email");
  const dob = formData.get("dob");
  const bloodGroup = formData.get("bloodGroup");
  const address = formData.get("address");
  const mobile = formData.get("mobile");
  const validity = formData.get("validity");
  const referralCode = formData.get("referralCode");
  const isAdminCreate = formData.get("isAdminCreate") === "true";

  if (!name || !email || !dob || !bloodGroup || !address || !mobile || !validity) {
    return errorResponse("All fields are required", 400);
  }

  let profilePicResult = null;
  let status = "pending";
  let isPublished = false;
  let notes = "";

  // Admin Override Logic
  if (isAdminCreate && isAdminUser) {
    status = formData.get("status") || "approved";
    isPublished = status === "approved";
    notes = formData.get("notes") || "";
  }

  // Profile Pic Upload
  const profilePicFile = formData.get("profilePic");
  if (profilePicFile && profilePicFile instanceof File) {
    profilePicResult = await uploadToCloudinary(profilePicFile, "volunteer-profiles");
  }

  const isFree = formData.get("isFree") === "true";

  // Calculate amount
  const finalAmount = (isAdminCreate && isFree) ? 0 : (VALIDITY_PRICES[validity] || 0);

  const volunteer = await Volunteer.create({
    name,
    email,
    dob: new Date(dob),
    bloodGroup,
    address,
    mobile,
    validity,
    volunteerType: validity,
    status,
    isPublished,
    notes,
    amount: finalAmount,
    referralCode,
    profilePicUrl: profilePicResult ? profilePicResult.secure_url : null,
    profilePicCloudinaryId: profilePicResult ? profilePicResult.public_id : null,
    ...(isAdminCreate && isAdminUser && { approvalDate: new Date(), approvedBy: "admin" }),
  });

  // Send Emails
  if (!isAdminCreate) {
    await sendConfirmationEmail(email, name);
  } else if (isAdminCreate && isAdminUser && status === "approved") {
    await sendApprovalEmail(email, volunteer);
  }

  return successResponse(volunteer, 201);
});
