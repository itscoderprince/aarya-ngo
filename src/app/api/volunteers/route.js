import { connectDB } from "@/lib/mongodb"
import Volunteer from "@/models/Volunteer"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { sendConfirmationEmail, sendApprovalEmail } from "@/lib/mailer"
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

const validityPrices = {
  "1year": 501,
  "3year": 1100,
  lifetime: 5100,
}

function generateVolunteerId() {
  const prefix = "VOL"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0")
  return `${prefix}-${timestamp}-${random}`
}

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const all = searchParams.get("all")
    const volunteerId = searchParams.get("volunteerId")

    if (volunteerId) {
      const volunteer = await Volunteer.findOne({ volunteerId })
      if (!volunteer) {
        return NextResponse.json({ error: "Volunteer not found" }, { status: 404 })
      }
      return NextResponse.json(volunteer)
    }

    if (all) {
      const volunteers = await Volunteer.find({}).sort({ createdAt: -1 })
      return NextResponse.json(volunteers)
    }

    const volunteers = await Volunteer.find({
      status: "approved",
      isPublished: true,
    }).sort({ createdAt: -1 })
    return NextResponse.json(volunteers)
  } catch (error) {
    console.log("[v0] GET volunteers error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")
    const isAdmin = token && validateAdminToken(token)

    await connectDB()

    const formData = await request.formData()
    const name = formData.get("name")
    const email = formData.get("email")
    const dob = formData.get("dob")
    const bloodGroup = formData.get("bloodGroup")
    const address = formData.get("address")
    const mobile = formData.get("mobile")
    const validity = formData.get("validity")
    const isAdminCreate = formData.get("isAdminCreate") === "true"

    if (!name || !email || !dob || !bloodGroup || !address || !mobile || !validity) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }

    let uploadResult = null
    let profilePicResult = null
    let status = "pending"
    let isPublished = false
    let notes = ""

    if (isAdminCreate && isAdmin) {
      status = formData.get("status") || "approved"
      isPublished = status === "approved"
      notes = formData.get("notes") || ""
    } else if (!isAdminCreate) {
      const receiptFile = formData.get("receipt")
      if (!receiptFile || !(receiptFile instanceof File)) {
        return NextResponse.json({ error: "Receipt file required" }, { status: 400 })
      }
      uploadResult = await uploadToCloudinary(receiptFile, "volunteer-receipts")
    }

    const profilePicFile = formData.get("profilePic")
    if (profilePicFile && profilePicFile instanceof File) {
      profilePicResult = await uploadToCloudinary(profilePicFile, "volunteer-profiles")
    }

    const volunteerId = generateVolunteerId()

    const volunteer = new Volunteer({
      name,
      email,
      dob: new Date(dob),
      bloodGroup,
      address,
      mobile,
      validity,
      status,
      isPublished,
      notes,
      amount: validityPrices[validity],
      volunteerId,
      paymentReceiptUrl: uploadResult ? uploadResult.secure_url : null,
      cloudinaryId: uploadResult ? uploadResult.public_id : null,
      profilePicUrl: profilePicResult ? profilePicResult.secure_url : null,
      profilePicCloudinaryId: profilePicResult ? profilePicResult.public_id : null,
      ...(isAdminCreate && isAdmin && { approvalDate: new Date(), approvedBy: "admin" }),
    })

    await volunteer.save()

    if (!isAdminCreate) {
      await sendConfirmationEmail(email, name)
    } else if (isAdminCreate && isAdmin && status === "approved") {
      await sendApprovalEmail(email, volunteer)
    }

    return NextResponse.json(volunteer, { status: 201 })
  } catch (error) {
    console.log("[v0] POST volunteer error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
