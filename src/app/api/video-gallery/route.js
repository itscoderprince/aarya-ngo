import { connectDB } from "@/lib/mongodb"
import VideoGallery from "@/models/VideoGallery"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { withAdminAuth } from "@/middleware/adminAuth"

export async function GET(request) {
  try {
    await connectDB()
    const videos = await VideoGallery.find({ isActive: true }).sort({ order: 1 })
    return Response.json(videos)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

const POST = withAdminAuth(async (request) => {
  try {
    await connectDB()

    const formData = await request.formData()
    const videoUrl = formData.get("videoUrl")
    const title = formData.get("title")
    const description = formData.get("description")
    const thumbnailFile = formData.get("thumbnail")

    if (!videoUrl || !title) {
      return Response.json({ error: "Video URL and title required" }, { status: 400 })
    }

    let thumbnail = null
    if (thumbnailFile) {
      const uploadResult = await uploadToCloudinary(thumbnailFile, "video-gallery")
      thumbnail = uploadResult.secure_url
    }

    const video = new VideoGallery({
      title,
      description,
      videoUrl,
      thumbnail,
    })

    await video.save()
    return Response.json(video, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
})

export { POST }
