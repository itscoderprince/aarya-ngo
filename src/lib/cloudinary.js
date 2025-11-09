import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(file, folder) {
  try {
    let bytes
    if (file instanceof File || file instanceof Blob) {
      bytes = await file.arrayBuffer()
    } else {
      bytes = await file.arrayBuffer()
    }

    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `aarya-ngo/${folder}`,
          resource_type: "auto",
          timeout: 60000,
        },
        (error, result) => {
          if (error) {
            console.log("[v0] Cloudinary upload error:", error)
            reject(error)
          } else {
            console.log("[v0] Cloudinary upload success:", result.public_id)
            resolve(result)
          }
        },
      )

      uploadStream.on("error", (error) => {
        console.log("[v0] Upload stream error:", error)
        reject(error)
      })

      uploadStream.end(buffer)
    })
  } catch (error) {
    console.log("[v0] Upload error:", error.message)
    throw error
  }
}

export async function deleteFromCloudinary(publicId) {
  try {
    return await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.log("[v0] Cloudinary delete error:", error.message)
    throw error
  }
}
