import { connectDB } from "@/lib/mongodb"
import Volunteer from "@/models/Volunteer"
import { uploadToCloudinary } from "@/lib/cloudinary"

const validityPrices = {
  "1year": 501,
  "3year": 1100,
  lifetime: 5100,
}

export async function GET(request) {
  try {
    await connectDB()
    const volunteers = await Volunteer.find({
      status: "approved",
      isPublished: true,
    }).sort({ createdAt: -1 })
    return Response.json(volunteers)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await connectDB()

    const formData = await request.formData()
    const name = formData.get("name")
    const dob = formData.get("dob")
    const bloodGroup = formData.get("bloodGroup")
    const address = formData.get("address")
    const mobile = formData.get("mobile")
    const validity = formData.get("validity")
    const receiptFile = formData.get("receipt")

    if (!name || !dob || !bloodGroup || !address || !mobile || !validity || !receiptFile) {
      return Response.json({ error: "All fields required" }, { status: 400 })
    }

    const uploadResult = await uploadToCloudinary(receiptFile, "volunteer-receipts")

    const volunteer = new Volunteer({
      name,
      dob: new Date(dob),
      bloodGroup,
      address,
      mobile,
      validity,
      amount: validityPrices[validity],
      paymentReceiptUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
    })

    await volunteer.save()
    return Response.json(volunteer, { status: 201 })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
