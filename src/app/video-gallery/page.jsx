"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function VideoGallery() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch("/api/video-gallery")
      if (response.ok) {
        const data = await response.json()
        setVideos(data)
      }
    } catch (err) {
      console.error("Failed to fetch videos")
    } finally {
      setLoading(false)
    }
  }

  const getEmbedUrl = (url) => {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return url
    }
    if (url.includes("vimeo.com")) {
      return url
    }
    return url
  }

  return (
    <div className="min-h-screen bg-gray-50">
  

      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Video Gallery</h1>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading videos...</p>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No videos available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative h-48 bg-gray-200">
                  {video.thumbnail ? (
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover hover:scale-105 transition"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-4xl">▶</div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={getEmbedUrl(selectedVideo.videoUrl)}
                  className="absolute inset-0 w-full h-full rounded-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{selectedVideo.title}</h3>
                <p className="text-gray-600 mb-6">{selectedVideo.description}</p>
                <button
                  onClick={() => setSelectedVideo(null)}
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
