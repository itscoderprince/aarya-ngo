import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadToCloudinary(file, folder) {
  try {
    let buffer;

    // Case 1: File/Blob from client
    if (typeof file.arrayBuffer === "function") {
      buffer = Buffer.from(await file.arrayBuffer());
    }
    // Case 2: Buffer from server (PDF)
    else if (Buffer.isBuffer(file)) {
      buffer = file;
    }
    // Case 3: Uint8Array, etc.
    else if (file instanceof Uint8Array) {
      buffer = Buffer.from(file);
    } else {
      throw new Error("Invalid file type for Cloudinary upload");
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `aarya-ngo/${folder}`,
          resource_type: "raw",      // BEST FOR PDF
          overwrite: true,
          unique_filename: false,
          use_filename: true,
        },
        (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }
      );

      streamifier.createReadStream(buffer).pipe(uploadStream);
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw error;
  }
}


export async function deleteFromCloudinary(publicId) {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("[v0] Cloudinary delete error:", error.message);
    throw error;
  }
}
