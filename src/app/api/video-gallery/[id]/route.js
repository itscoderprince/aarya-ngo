import { connectDB } from "@/lib/mongodb"
import VideoGallery from "@/models/VideoGallery"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"
import { withAdminAuth } from "@/middleware/adminAuth"

export async function GET(request, { params }) {
  try {
    await connectDB()
    const video = await VideoGallery.findById(params.id)
    if (!video) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json(video)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

const PUT = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB()

    const formData = await request.formData()
    const videoUrl = formData.get("videoUrl")
    const title = formData.get("title")
    const description = formData.get("description")
    const thumbnailFile = formData.get("thumbnail")
    const order = formData.get("order")

    const video = await VideoGallery.findById(params.id)
    if (!video) return Response.json({ error: "Not found" }, { status: 404 })

    if (thumbnailFile) {
      if (video.cloudinaryId) await deleteFromCloudinary(video.cloudinaryId)
      const uploadResult = await uploadToCloudinary(thumbnailFile, "video-gallery")
      video.thumbnail = uploadResult.secure_url
      video.cloudinaryId = uploadResult.public_id
    }

    if (videoUrl) video.videoUrl = videoUrl
    if (title) video.title = title
    if (description) video.description = description
    if (order !== undefined) video.order = Number.parseInt(order)

    await video.save()
    return Response.json(video)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
})

const DELETE = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB()

    const video = await VideoGallery.findByIdAndDelete(params.id)
    if (!video) return Response.json({ error: "Not found" }, { status: 404 })

    if (video.cloudinaryId) {
      await deleteFromCloudinary(video.cloudinaryId)
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
})

export { PUT, DELETE }
