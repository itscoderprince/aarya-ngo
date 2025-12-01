// models/Donation.js
import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
    {
        merchantOrderId: { type: String, required: true, index: true, unique: true },
        donorName: { type: String },
        donorEmail: { type: String },
        donorPhone: { type: String },
        pan: { type: String, default: null },
        amount: { type: Number }, // in rupees
        status: { type: String, default: "PENDING" },
        paymentInfo: { type: mongoose.Schema.Types.Mixed },
        receiptNumber: { type: String, default: null, unique: true, sparse: true },
        receiptPdfUrl: { type: String, default: null }, // <-- we save Cloudinary link here
    },
    { timestamps: true }
);

// Avoid recompiling model in dev HMR
export default mongoose.models.Donation || mongoose.model("Donation", DonationSchema);
