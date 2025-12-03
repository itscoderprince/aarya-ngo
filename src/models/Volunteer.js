import mongoose from "mongoose";

const volunteerSchema = new mongoose.Schema(
  {
    // --- Identity Fields ---
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      index: true,
    },
    merchantOrderId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },
    dob: {
      type: Date,
      required: [true, "Date of Birth is required"],
    },
    bloodGroup: {
      type: String,
      required: [true, "Blood Group is required"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    // --- Membership & Type ---
    volunteerType: {
      type: String,
      enum: ["1year", "3year", "lifetime", "free"],
      default: "1year",
      required: true,
    },
    // Kept for backward compatibility
    validity: {
      type: String,
      enum: ["1year", "3year", "lifetime", "free"],
      default: "1year",
    },

    // --- Generated Identifiers ---
    volunteerId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    sequence: {
      type: Number,
      unique: true,
      sparse: true,
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // --- Status & Meta ---
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "payment_failed"],
      default: "pending",
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      default: "",
    },

    // --- Payment & Amount ---
    amount: {
      type: Number,
      min: 0,
      default: 0,
    },
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // --- Media ---
    profilePicUrl: { type: String },
    profilePicCloudinaryId: { type: String },
    paymentReceiptUrl: { type: String },

    // --- Admin Meta ---
    approvedBy: { type: String },
    approvalDate: { type: Date },
    membershipExpireDate: { type: Date, index: true },
  },
  { timestamps: true }
);

// --- Pre-save Hooks ---
volunteerSchema.pre("save", async function (next) {
  // 1. Generate Volunteer ID
  if (!this.volunteerId) {
    const prefix = (this.volunteerType === "free" || this.amount === 0) ? "VOL-F" : "VOL-P";
    const year = new Date().getFullYear();

    // Find the last sequence number
    const lastRecord = await this.constructor.findOne({}, { sequence: 1 }).sort({ sequence: -1 });
    const nextSeq = (lastRecord && lastRecord.sequence) ? lastRecord.sequence + 1 : 201;

    this.sequence = nextSeq;
    this.volunteerId = `${prefix}-${year}-${nextSeq}`;
  }

  // 2. Generate Referral Code
  if (!this.referralCode && this.name) {
    const namePart = this.name.substring(0, 4).toUpperCase().replace(/\s/g, "");
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.referralCode = `${namePart}-${randomPart}`;
  }

  // 3. Calculate Expiry Date
  if (!this.membershipExpireDate && this.volunteerType !== "free") {
    const now = new Date();
    if (this.volunteerType === "1year") {
      this.membershipExpireDate = new Date(now.setFullYear(now.getFullYear() + 1));
    } else if (this.volunteerType === "3year") {
      this.membershipExpireDate = new Date(now.setFullYear(now.getFullYear() + 3));
    } else if (this.volunteerType === "lifetime") {
      this.membershipExpireDate = new Date(now.setFullYear(now.getFullYear() + 99));
    }
  }

  next();
});

export default mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema);