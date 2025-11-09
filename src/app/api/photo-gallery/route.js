import { connectDB } from "@/lib/mongodb"
import PhotoGallery from "@/models/PhotoGallery"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { withAdminAuth } from "@/middleware/adminAuth"

export async function GET(request) {
  try {
    await connectDB()
    const photos = await PhotoGallery.find({ isActive: true }).sort({ order: 1 })
    return Response.json(photos)
  } catch (error) {
    console.log("[v0] GET photos error:", error.message)
    return Response.json({ error: error.message }, { status: 500 })
  }
}

const POST = withAdminAuth(async (request) => {
  try {
    await connectDB()

    const formData = await request.formData()
    const file = formData.get("file")
    const title = formData.get("title")
    const description = formData.get("description") || ""
    const order = formData.get("order") || 0

    console.log("[v0] POST request - file:", file?.name, "title:", title)

    if (!file || !title) {
      return Response.json({ error: "File and title are required" }, { status: 400 })
    }

    const uploadResult = await uploadToCloudinary(file, "photo-gallery")
    console.log("[v0] Upload result:", uploadResult)

    const photo = new PhotoGallery({
      title,
      description,
      imageUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      order: Number.parseInt(order),
      isActive: true,
    })

    await photo.save()
    console.log("[v0] Photo saved:", photo._id)
    return Response.json(photo, { status: 201 })
  } catch (error) {
    console.log("[v0] POST error:", error.message, error.stack)
    return Response.json({ error: error.message }, { status: 500 })
  }
})

export { POST }
