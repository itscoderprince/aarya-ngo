import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    content: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: {
        values: ["document", "guide", "news", "other"],
        message: "{VALUE} is not a supported category",
      },
      default: "document",
      index: true,
    },
    fileUrl: {
      type: String,
      trim: true,
    },
    cloudinaryId: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Resource || mongoose.model("Resource", resourceSchema);
