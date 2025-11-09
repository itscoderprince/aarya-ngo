import { connectDB } from "@/lib/mongodb"
import Resource from "@/models/Resource"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"
import { withAdminAuth } from "@/middleware/adminAuth"

export async function GET(request, { params }) {
  try {
    await connectDB()
    const resource = await Resource.findById(params.id)
    if (!resource) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json(resource)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

const PUT = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB()

    const formData = await request.formData()
    const title = formData.get("title")
    const description = formData.get("description")
    const content = formData.get("content")
    const category = formData.get("category")
    const file = formData.get("file")
    const thumbnailFile = formData.get("thumbnail")
    const order = formData.get("order")

    const resource = await Resource.findById(params.id)
    if (!resource) return Response.json({ error: "Not found" }, { status: 404 })

    if (file) {
      if (resource.cloudinaryId) await deleteFromCloudinary(resource.cloudinaryId)
      const uploadResult = await uploadToCloudinary(file, "resources")
      resource.fileUrl = uploadResult.secure_url
      resource.cloudinaryId = uploadResult.public_id
    }

    if (thumbnailFile) {
      const uploadResult = await uploadToCloudinary(thumbnailFile, "resources/thumbnails")
      resource.thumbnail = uploadResult.secure_url
    }

    if (title) resource.title = title
    if (description) resource.description = description
    if (content) resource.content = content
    if (category) resource.category = category
    if (order !== undefined) resource.order = Number.parseInt(order)

    await resource.save()
    return Response.json(resource)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
})

const DELETE = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB()

    const resource = await Resource.findByIdAndDelete(params.id)
    if (!resource) return Response.json({ error: "Not found" }, { status: 404 })

    if (resource.cloudinaryId) {
      await deleteFromCloudinary(resource.cloudinaryId)
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
})

export { PUT, DELETE }
