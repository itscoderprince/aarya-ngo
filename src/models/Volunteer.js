import mongoose from "mongoose";
import crypto from "crypto";

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
      required: false, // Changed to false to support legacy data
      unique: true,
      sparse: true,    // Allows multiple documents to have no merchantOrderId
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
    // Kept for backward compatibility, synced with volunteerType
    validity: {
      type: String,
      enum: ["1year", "3year", "lifetime", "free"],
      default: "1year",
    },

    // --- Generated Identifiers ---
    // Format: VOL-P-2025-201 or VOL-F-2025-201
    volunteerId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      index: true,
    },
    // Format: NAME-XXXX (e.g., PRIN-A2B4)
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    // Auto-calculated based on type
    membershipExpireDate: {
      type: Date,
      index: true,
      default: null,
    },

    // --- Status & Meta ---
    status: {
      type: String,
      // enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },

    // --- Payment & Amount ---
    amount: {
      type: Number,
      min: 0,
      default: 0,
    },
    paymentDetails: {
      type: mongoose.Schema.Types.Mixed,
      select: false, // Optimization: Don't load heavy payment logs by default
    },
    paymentReceiptUrl: { type: String },

    // --- Media ---
    profilePicUrl: { type: String },
    profilePicCloudinaryId: { type: String },
    cloudinaryId: { type: String },

    // --- Admin Info ---
    notes: { type: String, trim: true },
    approvedBy: { type: String },
    approvalDate: { type: Date },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// ==========================================
// 1. HELPER: Generate Referral Code
// ==========================================
const generateReferralCode = (name) => {
  // Take first 4 letters of name, remove spaces/symbols, uppercase
  // Example: "Prince Sharma" -> "PRIN"
  const namePrefix = name.replace(/[^a-zA-Z]/g, "").substring(0, 4).toUpperCase();

  // Generate 4 random characters (Hex)
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase().substring(0, 4);

  return `${namePrefix}-${randomSuffix}`;
};

// ==========================================
// 2. HELPER: Generate Volunteer ID
// ==========================================
const generateCustomId = async (model, typeCode, year) => {
  const prefix = `VOL-${typeCode}-${year}`;

  // Find the most recent volunteer with this specific prefix
  const lastRecord = await model.findOne({
    volunteerId: { $regex: `^${prefix}` }
  })
    .sort({ createdAt: -1 }) // Sort by newest first
    .select("volunteerId");

  let newSequence = 201; // Start counting from 201

  if (lastRecord && lastRecord.volunteerId) {
    // ID Format: VOL-P-2025-201
    // Split by '-' to get parts: ["VOL", "P", "2025", "201"]
    const parts = lastRecord.volunteerId.split("-");
    const lastNum = parseInt(parts[parts.length - 1]);

    if (!isNaN(lastNum)) {
      newSequence = lastNum + 1;
    }
  }

  return `${prefix}-${newSequence}`;
};

// ==========================================
// 3. PRE-SAVE HOOK (The Automation Logic)
// ==========================================
volunteerSchema.pre("save", async function (next) {
  const now = new Date();
  const currentYear = now.getFullYear();

  // --- A. Calculate Expiry Date & Sync Validity ---
  // Only run if volunteerType changed or it's a new record
  if (this.isModified("volunteerType") || this.isNew) {
    this.validity = this.volunteerType; // Keep fields in sync

    switch (this.volunteerType) {
      case "1year":
        this.membershipExpireDate = new Date(now.setFullYear(now.getFullYear() + 1));
        break;
      case "3year":
        this.membershipExpireDate = new Date(now.setFullYear(now.getFullYear() + 3));
        break;
      case "lifetime":
        this.membershipExpireDate = null;
        break;
      case "free":
        // Assuming Free is 1 year renewable, or set to null if lifetime free
        this.membershipExpireDate = new Date(now.setFullYear(now.getFullYear() + 1));
        break;
      default:
        this.membershipExpireDate = null;
    }
  }

  // --- B. Generate Referral Code (If missing) ---
  if (!this.referralCode) {
    let isUnique = false;
    while (!isUnique) {
      const code = generateReferralCode(this.name);
      // Check if code exists in DB to avoid collision
      const existing = await mongoose.models.Volunteer.findOne({ referralCode: code });
      if (!existing) {
        this.referralCode = code;
        isUnique = true;
      }
    }
  }

  // --- C. Generate Volunteer ID (If missing) ---
  if (!this.volunteerId) {
    // P = Paid (1yr, 3yr, Lifetime), F = Free
    const typeCode = this.volunteerType === "free" ? "F" : "P";

    // Use 'this.constructor' to access the Model within the document
    this.volunteerId = await generateCustomId(
      this.constructor,
      typeCode,
      currentYear
    );
  }

  next();
});

const Volunteer = mongoose.models.Volunteer || mongoose.model("Volunteer", volunteerSchema);

export default Volunteer;