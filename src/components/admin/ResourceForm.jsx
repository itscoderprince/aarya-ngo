"use client"

import { useState } from "react"
import { FileText, Image as ImageIcon, Layout, Type, Upload, Loader2, X } from "lucide-react"
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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100 bg-gray-50/50">
        <h2 className="text-xl font-bold text-[#022741]">
          {resource ? "Edit Resource" : "Add New Resource"}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Manage documents, guides, and news updates.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
              <div className="relative">
                <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
                  required
                  placeholder="e.g., Annual Report 2024"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
              <div className="relative">
                <Layout className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition appearance-none"
                >
                  <option value="document">Document</option>
                  <option value="guide">Guide</option>
                  <option value="news">News</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Display Order</label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number.parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition h-[180px] resize-none"
              placeholder="Brief summary of the resource..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Detailed Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition"
            rows="4"
            placeholder="Enter rich text content or resource details..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 border-dashed">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Resource File
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {resource?.fileUrl && !file && (
              <p className="text-xs text-gray-500 mt-2 break-all bg-white p-2 rounded border">
                Current: {resource.fileUrl.split('/').pop()}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 border-dashed">
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              Thumbnail Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {preview && (
              <div className="mt-3 relative w-full h-32 bg-white rounded-lg border overflow-hidden">
                <Image src={preview} alt="Preview" fill className="object-contain" />
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-xl transition"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-[#022741] text-white font-medium rounded-xl hover:bg-[#033a61] disabled:opacity-70 disabled:cursor-not-allowed transition shadow-lg shadow-blue-900/20 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Saving..." : "Save Resource"}
          </button>
        </div>
      </form>
    </div>
  )
}
