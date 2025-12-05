import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Volunteer from "@/models/Volunteer";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { sendApprovalEmail, sendUpdateEmail, sendRejectionEmail } from "@/lib/mailer";
import { verifyToken } from "@/middleware/adminAuth";

// ==========================================
// 1. SECURITY & HELPERS
// ==========================================

function checkAdmin(request) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "");
  if (!token) return false;
  return verifyToken(token); // Returns payload or null
}

/**
 * Standardized Error Response
 */
function handleError(error, context) {
  console.error(`[API Error - ${context}]:`, error.message);
  return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
}

// ==========================================
// 2. GET: Fetch Single Volunteer
// ==========================================
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    await connectDB();
    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }

    return NextResponse.json(volunteer);
  } catch (error) {
    return handleError(error, "GET Volunteer");
  }
}

// ==========================================
// 3. PUT: Update Volunteer (Details or Status)
// ==========================================
export async function PUT(request, { params }) {
  // A. Security Check
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();
    const volunteer = await Volunteer.findById(id);

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }

    // B. Parse Input (Unify JSON and FormData)
    const contentType = request.headers.get("content-type") || "";
    let updateData = {};
    let profilePicFile = null;

    if (contentType.includes("application/json")) {
      updateData = await request.json();
    } else if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      // Convert FormData to standard Object
      for (const [key, value] of formData.entries()) {
        if (key !== "profilePic") updateData[key] = value;
      }
      profilePicFile = formData.get("profilePic");
    }

    // C. Handle Profile Picture Upload (If exists)
    if (profilePicFile && profilePicFile instanceof File) {
      // 1. Delete old image if it exists
      if (volunteer.profilePicCloudinaryId) {
        await deleteFromCloudinary(volunteer.profilePicCloudinaryId).catch(err =>
          console.warn("Failed to delete old image:", err.message)
        );
      }
      // 2. Upload new image
      const uploadResult = await uploadToCloudinary(profilePicFile, "volunteer-profiles");
      volunteer.profilePicUrl = uploadResult.secure_url;
      volunteer.profilePicCloudinaryId = uploadResult.public_id;
    }

    // D. Update Standard Fields
    // Only update fields if they are present in the request
    const fields = ["name", "email", "dob", "bloodGroup", "address", "mobile", "validity", "notes"];
    fields.forEach((field) => {
      if (updateData[field] !== undefined && updateData[field] !== null) {
        // Handle Date conversion specifically
        volunteer[field] = field === "dob" ? new Date(updateData[field]) : updateData[field];
      }
    });

    // E. Handle Status Logic & Emails (State Machine)
    // We check if status IS changing to decide on emails
    if (updateData.status && updateData.status !== volunteer.status) {
      const newStatus = updateData.status;
      volunteer.status = newStatus;

      if (newStatus === "approved") {
        volunteer.approvalDate = new Date();
        volunteer.approvedBy = "admin";
        volunteer.isPublished = true;
        await sendApprovalEmail(volunteer.email, volunteer);
      }
      else if (newStatus === "rejected") {
        volunteer.isPublished = false;
        await sendRejectionEmail(volunteer.email, volunteer.name);
      }
      else {
        // Pending or other statuses
        volunteer.isPublished = false;
      }
    } else {
      // Status didn't change, but we updated details via FormData
      // Only send update email if it was a form submission (not just a JSON status toggle)
      if (contentType.includes("multipart/form-data")) {
        await sendUpdateEmail(volunteer.email, volunteer);
      }
    }

    // F. Save & Return
    volunteer.updatedAt = new Date();
    await volunteer.save();

    return NextResponse.json(volunteer);

  } catch (error) {
    return handleError(error, "PUT Volunteer");
  }
}

// ==========================================
// 4. DELETE: Remove Volunteer
// ==========================================
export async function DELETE(request, { params }) {
  // Security Check
  if (!checkAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectDB();
    const volunteer = await Volunteer.findByIdAndDelete(id);

    if (!volunteer) {
      return NextResponse.json({ error: "Volunteer not found" }, { status: 404 });
    }

    // Optional: Clean up their image from Cloudinary when deleting user
    if (volunteer.profilePicCloudinaryId) {
      await deleteFromCloudinary(volunteer.profilePicCloudinaryId).catch(err =>
        console.warn("Failed to delete cloud image:", err.message)
      );
    }

    return NextResponse.json({ message: "Volunteer deleted successfully" });
  } catch (error) {
    return handleError(error, "DELETE Volunteer");
  }
}