import { connectDB } from "@/lib/mongodb";
import Resource from "@/models/Resource";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { withAdminAuth } from "@/middleware/adminAuth";
import { apiHandler, successResponse, errorResponse } from "@/lib/api-utils";

export const GET = apiHandler(async (request, { params }) => {
  const { id } = await params; // Next.js 15: params is a Promise

  await connectDB();
  const resource = await Resource.findById(id).lean();

  if (!resource) {
    return errorResponse("Resource not found", 404);
  }

  return successResponse(resource);
});

const updateResource = async (request, { params }) => {
  const { id } = await params;
  await connectDB();

  const formData = await request.formData();
  const title = formData.get("title");
  const description = formData.get("description");
  const content = formData.get("content");
  const category = formData.get("category");
  const file = formData.get("file");
  const thumbnailFile = formData.get("thumbnail");
  const order = formData.get("order");

  const resource = await Resource.findById(id);
  if (!resource) {
    return errorResponse("Resource not found", 404);
  }

  // Update File
  if (file && file.size > 0) {
    if (resource.cloudinaryId) {
      await deleteFromCloudinary(resource.cloudinaryId);
    }
    const uploadResult = await uploadToCloudinary(file, "resources");
    resource.fileUrl = uploadResult.secure_url;
    resource.cloudinaryId = uploadResult.public_id;
  }

  // Update Thumbnail
  if (thumbnailFile && thumbnailFile.size > 0) {
    const uploadResult = await uploadToCloudinary(thumbnailFile, "resources/thumbnails");
    resource.thumbnail = uploadResult.secure_url;
  }

  // Update Text Fields
  if (title) resource.title = title;
  if (description) resource.description = description;
  if (content) resource.content = content;
  if (category) resource.category = category;
  if (order !== null && order !== undefined) resource.order = parseInt(order);

  await resource.save();
  return successResponse(resource);
};

const deleteResource = async (request, { params }) => {
  const { id } = await params;
  await connectDB();

  const resource = await Resource.findByIdAndDelete(id);
  if (!resource) {
    return errorResponse("Resource not found", 404);
  }

  if (resource.cloudinaryId) {
    await deleteFromCloudinary(resource.cloudinaryId);
  }

  return successResponse({ message: "Resource deleted successfully" });
};

// Wrap handlers
export const PUT = withAdminAuth(apiHandler(updateResource));
export const DELETE = withAdminAuth(apiHandler(deleteResource));
