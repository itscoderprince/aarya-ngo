import mongoose from "mongoose"

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    content: String,
    category: {
      type: String,
      enum: ["document", "guide", "news", "other"],
      default: "document",
    },
    fileUrl: String,
    cloudinaryId: String,
    thumbnail: String,
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
)

export default mongoose.models.Resource || mongoose.model("Resource", resourceSchema)
