import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
    {
        merchantOrderId: {
            type: String,
            required: true,
            index: true,
            unique: true,
        },
        donorName: {
            type: String,
            required: [true, "Donor name is required"],
            trim: true,
        },
        donorEmail: {
            type: String,
            required: [true, "Donor email is required"],
            trim: true,
            lowercase: true,
        },
        donorPhone: {
            type: String,
            required: [true, "Donor phone is required"],
            trim: true,
        },
        pan: {
            type: String,
            default: null,
            trim: true,
            uppercase: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [1, "Amount must be at least 1"],
        },
        status: {
            type: String,
            enum: ["pending", "payment_success", "payment_failed"],
            default: "pending",
            index: true,
        },
        paymentInfo: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        receiptNumber: {
            type: String,
            default: null,
            unique: true,
            sparse: true,
        },
        receiptPdfUrl: {
            type: String,
            default: null,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);
