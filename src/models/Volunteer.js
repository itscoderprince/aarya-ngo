import mongoose from "mongoose"

const volunteerSchema = new mongoose.Schema({
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
    default: "1year",
  },
  amount: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
  },
  paymentReceiptUrl: {
    type: String,
  },
  profilePicUrl: {
    type: String,
  },
  profilePicCloudinaryId: {
    type: String,
  },
  // END CHANGE
  cloudinaryId: {
    type: String,
  },
  approvalDate: {
    type: Date,
  },
  approvedBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

const Volunteer = mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema)

export default Volunteer
