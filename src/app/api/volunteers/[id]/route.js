import { connectDB } from "@/lib/mongodb"
import Volunteer from "@/models/Volunteer"
import { withAdminAuth } from "@/middleware/adminAuth"

export async function GET(request, { params }) {
  try {
    await connectDB()
    const volunteer = await Volunteer.findById(params.id)
    if (!volunteer) return Response.json({ error: "Not found" }, { status: 404 })
    return Response.json(volunteer)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}

const PUT = withAdminAuth(async (request, { params }) => {
  try {
    await connectDB()

    const formData = await request.formData()
    const name = formData.get("name")
    const dob = formData.get("dob")
    const bloodGroup = formData.get("bloodGroup")
    const address = formData.get("address")
    const mobile = formData.get("mobile")
    const validity = formData.get("validity")
    const status = formData.get("status")
    const notes = formData.get("notes")
    const isPublished = formData.get("isPublished")

    const volunteer = await Volunteer.findById(params.id)
    if (!volunteer) return Response.json({ error: "Not found" }, { status: 404 })

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
      }
    }
    if (notes !== undefined) volunteer.notes = notes
    if (isPublished !== undefined) volunteer.isPublished = isPublished === "true"

    await volunteer.save()
    return Response.json(volunteer)
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
})

export { PUT }
