import { connectDB } from "@/lib/mongodb"
import PhotoGallery from "@/models/PhotoGallery"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"
import { withAdminAuth } from "@/middleware/adminAuth"
import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  try {
    await connectDB()
    const photo = await PhotoGallery.findById(params.id)
    if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(photo)
  } catch (error) {
    console.log("[v0] GET error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

const PUT = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB()

    const formData = await request.formData()
    const file = formData.get("file")
    const title = formData.get("title")
    const description = formData.get("description")
    const order = formData.get("order")

    console.log("[v0] PUT request - params:", params, "title:", title)

    const photo = await PhotoGallery.findById(params.id)
    if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (file) {
      if (photo.cloudinaryId) {
        await deleteFromCloudinary(photo.cloudinaryId)
      }
      const uploadResult = await uploadToCloudinary(file, "photo-gallery")
      photo.imageUrl = uploadResult.secure_url
      photo.cloudinaryId = uploadResult.public_id
    }

    if (title) photo.title = title
    if (description) photo.description = description
    if (order !== undefined && order !== null) photo.order = Number.parseInt(order)

    await photo.save()
    console.log("[v0] Photo updated:", photo._id)
    return NextResponse.json(photo)
  } catch (error) {
    console.log("[v0] PUT error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

const DELETE = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB()

    console.log("[v0] DELETE request - params:", params)

    const photo = await PhotoGallery.findByIdAndDelete(params.id)
    if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 })

    if (photo.cloudinaryId) {
      await deleteFromCloudinary(photo.cloudinaryId)
    }

    console.log("[v0] Photo deleted:", params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.log("[v0] DELETE error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
})

export { PUT, DELETE }
