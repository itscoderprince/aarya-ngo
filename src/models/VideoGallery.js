import mongoose from "mongoose"

const videoGallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    videoUrl: {
      type: String,
      required: true,
    },
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

export default mongoose.models.VideoGallery || mongoose.model("VideoGallery", videoGallerySchema)
