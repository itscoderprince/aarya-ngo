import mongoose from "mongoose"

const photoGallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    imageUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: String,
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

export default mongoose.models.PhotoGallery || mongoose.model("PhotoGallery", photoGallerySchema)
