import mongoose from "mongoose"

const volunteerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
    },
    validity: {
      type: String,
      enum: ["1year", "3year", "lifetime"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentReceiptUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approvedBy: String,
    approvalDate: Date,
    notes: String,
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema)
