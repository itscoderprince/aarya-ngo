import { connectDB } from "@/lib/mongodb"
import Volunteer from "@/models/Volunteer"
import { uploadToCloudinary } from "@/lib/cloudinary"
import { NextResponse } from "next/server"

const validityPrices = {
  "1year": 501,
  "3year": 1100,
  lifetime: 5100,
}

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const all = searchParams.get("all")

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
    const isAdmin = token === process.env.ADMIN_TOKEN

    await connectDB()

    const formData = await request.formData()
    const name = formData.get("name")
    const dob = formData.get("dob")
    const bloodGroup = formData.get("bloodGroup")
    const address = formData.get("address")
    const mobile = formData.get("mobile")
    const validity = formData.get("validity")
    const isAdminCreate = formData.get("isAdminCreate") === "true"

    if (!name || !dob || !bloodGroup || !address || !mobile || !validity) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 })
    }

    let uploadResult = null
    let profilePicResult = null
    let status = "pending"
    let isPublished = false
    let notes = ""

    if (isAdminCreate && isAdmin) {
      status = formData.get("status") || "approved"
      isPublished = formData.get("isPublished") === "true"
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
    // END CHANGE

    const volunteer = new Volunteer({
      name,
      dob: new Date(dob),
      bloodGroup,
      address,
      mobile,
      validity,
      status,
      isPublished,
      notes,
      amount: validityPrices[validity],
      paymentReceiptUrl: uploadResult ? uploadResult.secure_url : null,
      cloudinaryId: uploadResult ? uploadResult.public_id : null,
      profilePicUrl: profilePicResult ? profilePicResult.secure_url : null,
      profilePicCloudinaryId: profilePicResult ? profilePicResult.public_id : null,
      // END CHANGE
      ...(isAdminCreate && isAdmin && { approvalDate: new Date(), approvedBy: "admin" }),
    })

    await volunteer.save()
    return NextResponse.json(volunteer, { status: 201 })
  } catch (error) {
    console.log("[v0] POST volunteer error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
