"use client"

import { useState } from "react"
import Image from "next/image"

export default function ResourceForm({ resource, onSubmit, onCancel }) {
  const [title, setTitle] = useState(resource?.title || "")
  const [description, setDescription] = useState(resource?.description || "")
  const [content, setContent] = useState(resource?.content || "")
  const [category, setCategory] = useState(resource?.category || "document")
  const [file, setFile] = useState(null)
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [preview, setPreview] = useState(resource?.thumbnail || "")
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(resource?.order || 0)

  const handleFileChange = (e) => {
    setFile(e.target.files[0])
  }

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
      formData.append("content", content)
      formData.append("category", category)
      formData.append("order", order)
      if (file) formData.append("file", file)
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
          rows="2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        >
          <option value="document">Document</option>
          <option value="guide">Guide</option>
          <option value="news">News</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
          rows="4"
          placeholder="Enter rich text content or resource details"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">File (PDF, Document)</label>
        <input type="file" onChange={handleFileChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
        {resource?.fileUrl && !file && <p className="text-sm text-gray-600 mt-2">Current file: {resource.fileUrl}</p>}
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
          {loading ? "Saving..." : "Save Resource"}
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
