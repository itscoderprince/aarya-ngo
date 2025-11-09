import { connectDB } from "@/lib/mongodb"
import Resource from "@/models/Resource"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { withAdminAuth } from "@/middleware/adminAuth"

export async function GET(request) {
  try {
    await connectDB()
    const resources = await Resource.find({ isActive: true }).sort({ order: 1 })
    return Response.json(resources)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

const POST = withAdminAuth(async (request) => {
  try {
    await connectDB()

    const formData = await request.formData()
    const title = formData.get("title")
    const description = formData.get("description")
    const content = formData.get("content")
    const category = formData.get("category")
    const file = formData.get("file")
    const thumbnailFile = formData.get("thumbnail")

    if (!title) {
      return Response.json({ error: "Title required" }, { status: 400 })
    }

    let fileUrl = null
    let cloudinaryId = null
    if (file) {
      const uploadResult = await uploadToCloudinary(file, "resources")
      fileUrl = uploadResult.secure_url
      cloudinaryId = uploadResult.public_id
    }

    let thumbnail = null
    if (thumbnailFile) {
      const uploadResult = await uploadToCloudinary(thumbnailFile, "resources/thumbnails")
      thumbnail = uploadResult.secure_url
    }

    const resource = new Resource({
      title,
      description,
      content,
      category,
      fileUrl,
      cloudinaryId,
      thumbnail,
    })

    await resource.save()
    return Response.json(resource, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
})

export { POST }
