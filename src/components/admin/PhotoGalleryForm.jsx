"use client"

import { useState } from "react"
import Image from "next/image"

export default function PhotoGalleryForm({ photo, onSubmit, onCancel }) {
  const [title, setTitle] = useState(photo?.title || "")
  const [description, setDescription] = useState(photo?.description || "")
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(photo?.imageUrl || "")
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(photo?.order || 0)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB")
        return
      }
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (event) => setPreview(event.target.result)
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      alert("Title is required")
      return
    }

    if (!file && !photo) {
      alert("Image is required for new photos")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("order", order)
      if (file) formData.append("file", file)

      await onSubmit(formData)
    } catch (error) {
      console.log("[v0] Form submit error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 shadow-lg space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number.parseInt(e.target.value) || 0)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Image {!photo && "*"}</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <p className="text-xs text-gray-500 mt-1">Max 5MB. Formats: JPEG, PNG, GIF</p>
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
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 font-medium"
        >
          {loading ? "Saving..." : "Save Photo"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-lg hover:bg-gray-400 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
