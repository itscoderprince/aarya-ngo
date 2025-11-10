import { connectDB } from "@/lib/mongodb"
import Volunteer from "@/models/Volunteer"
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary"
import { NextResponse } from "next/server"

function validateAdminToken(token) {
  if (!token) return false
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8")
    const [username, password] = decoded.split(":")
    return username === "admin" && password === "admin123"
  } catch (e) {
    return false
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB()
    const volunteer = await Volunteer.findById(params.id)
    if (!volunteer) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(volunteer)
  } catch (error) {
    console.log("[v0] GET volunteer error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !validateAdminToken(token)) {
      console.log("[v0] Authorization failed - invalid token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const contentType = request.headers.get("content-type")
    let jsonData = {}
    let formData

    if (contentType?.includes("application/json")) {
      jsonData = await request.json()
      console.log("[v0] Received JSON data:", jsonData)
    } else if (contentType?.includes("multipart/form-data")) {
      formData = await request.formData()
      console.log("[v0] Received form data")
    }

    const volunteer = await Volunteer.findById(params.id)
    if (!volunteer) return NextResponse.json({ error: "Not found" }, { status: 404 })

    // Handle JSON updates (for approve/reject)
    if (jsonData.status) {
      console.log("[v0] Updating status to:", jsonData.status)
      volunteer.status = jsonData.status
      if (jsonData.status === "approved") {
        volunteer.approvalDate = new Date()
        volunteer.approvedBy = "admin"
        volunteer.isPublished = true
      } else {
        volunteer.isPublished = false
      }
      volunteer.updatedAt = new Date()
      await volunteer.save()
      console.log("[v0] Status updated successfully")
      return NextResponse.json(volunteer)
    }

    // Handle FormData updates (for form edits)
    if (formData) {
      const name = formData?.get("name")
      const dob = formData?.get("dob")
      const bloodGroup = formData?.get("bloodGroup")
      const address = formData?.get("address")
      const mobile = formData?.get("mobile")
      const validity = formData?.get("validity")
      const status = formData?.get("status")
      const notes = formData?.get("notes")

      if (name) volunteer.name = name
      if (dob) volunteer.dob = new Date(dob)
      if (bloodGroup) volunteer.bloodGroup = bloodGroup
      if (address) volunteer.address = address
      if (mobile) volunteer.mobile = mobile
      if (validity) volunteer.validity = validity
      if (status) {
        volunteer.status = status
        if (status === "approved") {
          volunteer.approvalDate = new Date()
          volunteer.approvedBy = "admin"
          volunteer.isPublished = true
        } else {
          volunteer.isPublished = false
        }
      }
      if (notes !== null && notes !== undefined) volunteer.notes = notes

      const profilePicFile = formData?.get("profilePic")
      if (profilePicFile && profilePicFile instanceof File) {
        // Delete old profile pic if exists
        if (volunteer.profilePicCloudinaryId) {
          try {
            await deleteFromCloudinary(volunteer.profilePicCloudinaryId)
          } catch (err) {
            console.log("[v0] Error deleting old profile pic:", err)
          }
        }
        // Upload new profile pic
        const profilePicResult = await uploadToCloudinary(profilePicFile, "volunteer-profiles")
        volunteer.profilePicUrl = profilePicResult.secure_url
        volunteer.profilePicCloudinaryId = profilePicResult.public_id
      }
    }

    volunteer.updatedAt = new Date()
    await volunteer.save()
    return NextResponse.json(volunteer)
  } catch (error) {
    console.log("[v0] PUT volunteer error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !validateAdminToken(token)) {
      console.log("[v0] DELETE Authorization failed - invalid token")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectDB()

    const volunteer = await Volunteer.findByIdAndDelete(params.id)
    if (!volunteer) return NextResponse.json({ error: "Not found" }, { status: 404 })

    console.log("[v0] Volunteer deleted successfully:", params.id)
    return NextResponse.json({ message: "Deleted successfully" })
  } catch (error) {
    console.log("[v0] DELETE volunteer error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
