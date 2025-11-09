"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function PhotoGallery() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const response = await fetch("/api/photo-gallery")
      if (response.ok) {
        const data = await response.json()
        setPhotos(data)
      }
    } catch (err) {
      console.error("Failed to fetch photos")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Photo Gallery</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading photos...</p>
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No photos available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div
                key={photo._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="relative h-64">
                  <Image
                    src={photo.imageUrl || "/placeholder.svg"}
                    alt={photo.title}
                    fill
                    className="object-cover hover:scale-105 transition"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{photo.title}</h3>
                  <p className="text-gray-600 text-sm">{photo.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full">
              <div className="relative h-96 bg-gray-200">
                <Image
                  src={selectedPhoto.imageUrl || "/placeholder.svg"}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedPhoto.title}</h3>
                <p className="text-gray-600 mb-6">{selectedPhoto.description}</p>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
