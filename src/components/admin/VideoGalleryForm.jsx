"use client"

import { useState } from "react"
import Image from "next/image"

export default function VideoGalleryForm({ video, onSubmit, onCancel }) {
  const [title, setTitle] = useState(video?.title || "")
  const [description, setDescription] = useState(video?.description || "")
  const [videoUrl, setVideoUrl] = useState(video?.videoUrl || "")
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [preview, setPreview] = useState(video?.thumbnail || "")
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(video?.order || 0)

  const handleThumbnailChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setThumbnailFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => setPreview(event.target.result)
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("videoUrl", videoUrl)
      formData.append("order", order)
      if (thumbnailFile) formData.append("thumbnail", thumbnailFile)

      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube, Vimeo, etc.)</label>
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://youtube.com/embed/..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number.parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      {preview && (
        <div className="relative w-full h-48">
          <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-contain" />
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? "Saving..." : "Save Video"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
