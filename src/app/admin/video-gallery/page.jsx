"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import VideoGalleryForm from "@/components/admin/VideoGalleryForm"
import Image from "next/image"

export default function AdminVideoGallery() {
  const router = useRouter()
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
    fetchVideos()
  }, [router])

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/video-gallery", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (err) {
      setError("Failed to fetch videos")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("adminToken")
      const url = editingVideo ? `/api/video-gallery/${editingVideo._id}` : "/api/video-gallery"
      const method = editingVideo ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (response.ok) {
        setShowForm(false)
        setEditingVideo(null)
        fetchVideos()
      } else {
        setError("Failed to save video")
      }
    } catch (err) {
      setError("An error occurred")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/video-gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchVideos()
      } else {
        setError("Failed to delete video")
      }
    } catch (err) {
      setError("An error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Video Gallery</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={() => {
                setEditingVideo(null)
                setShowForm(!showForm)
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {showForm ? "Cancel" : "Add Video"}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {showForm && (
          <div className="mb-8">
            <VideoGalleryForm
              video={editingVideo}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingVideo(null)
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video._id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-48 bg-gray-200">
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">No thumbnail</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm mb-2 truncate">{video.videoUrl}</p>
                  <p className="text-gray-600 text-sm mb-4">{video.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingVideo(video)
                        setShowForm(true)
                      }}
                      className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(video._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
