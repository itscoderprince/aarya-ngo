"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import PhotoGalleryForm from "@/components/admin/PhotoGalleryForm"
import Image from "next/image"

export default function AdminPhotoGallery() {
  const router = useRouter()
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPhoto, setEditingPhoto] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
    fetchPhotos()
  }, [router])

  const fetchPhotos = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/photo-gallery", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
      if (response.ok) {
        const data = await response.json()
        setPhotos(data)
        setError("")
      } else {
        const errorData = await response.json()
        setError(errorData.error || "Failed to fetch photos")
      }
    } catch (err) {
      console.log("[v0] Fetch error:", err)
      setError("Failed to fetch photos")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      setError("")
      const token = localStorage.getItem("adminToken")
      const url = editingPhoto ? `/api/photo-gallery/${editingPhoto._id}` : "/api/photo-gallery"
      const method = editingPhoto ? "PUT" : "POST"

      console.log("[v0] Submitting:", method, url)

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const responseData = await response.json()
      console.log("[v0] Response:", response.status, responseData)

      if (response.ok) {
        setShowForm(false)
        setEditingPhoto(null)
        await fetchPhotos()
      } else {
        setError(responseData.error || "Failed to save photo")
      }
    } catch (err) {
      console.log("[v0] Submit error:", err)
      setError(err.message || "An error occurred")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this photo?")) return

    try {
      setError("")
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/photo-gallery/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        await fetchPhotos()
      } else {
        const data = await response.json()
        setError(data.error || "Failed to delete photo")
      }
    } catch (err) {
      setError("An error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Photo Gallery</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={() => {
                setEditingPhoto(null)
                setShowForm(!showForm)
                setError("")
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {showForm ? "Cancel" : "Add Photo"}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {showForm && (
          <div className="mb-8">
            <PhotoGalleryForm
              photo={editingPhoto}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingPhoto(null)
                setError("")
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo._id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="relative h-48">
                  <Image src={photo.imageUrl || "/placeholder.svg"} alt={photo.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{photo.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{photo.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingPhoto(photo)
                        setShowForm(true)
                      }}
                      className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(photo._id)}
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
