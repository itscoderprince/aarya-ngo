import { connectDB } from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { withAdminAuth } from "@/middleware/adminAuth";
import { apiHandler, successResponse, errorResponse } from "@/lib/api-utils";

export const GET = apiHandler(async () => {
  await connectDB();
  const resources = await Resource.find({ isActive: true })
    .sort({ order: 1 })
    .lean(); // Optimize query
  return successResponse(resources);
});

const createResource = async (request) => {
  await connectDB();

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const content = formData.get("content");
  const category = formData.get("category");
  const file = formData.get("file");
  const thumbnailFile = formData.get("thumbnail");

  // Validation
  if (!title || title.trim().length === 0) {
    return errorResponse("Title is required", 400);
  }

  let fileUrl = null;
  let cloudinaryId = null;
  if (file && file.size > 0) {
    const uploadResult = await uploadToCloudinary(file, "resources");
    fileUrl = uploadResult.secure_url;
    cloudinaryId = uploadResult.public_id;
  }

  let thumbnail = null;
  if (thumbnailFile && thumbnailFile.size > 0) {
    const uploadResult = await uploadToCloudinary(thumbnailFile, "resources/thumbnails");
    thumbnail = uploadResult.secure_url;
  }

  const resource = await Resource.create({
    title,
    description,
    content,
    category,
    fileUrl,
    cloudinaryId,
    thumbnail,
  });

  return successResponse(resource, 201);
};

// Wrap POST with Auth and Error Handling
export const POST = withAdminAuth(apiHandler(createResource));
