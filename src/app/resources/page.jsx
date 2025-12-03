"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function Resources() {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchResources()
  }, [])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources")
      if (response.ok) {
        const result = await response.json()
        // FIX: Handle standardized API response { success: true, data: [...] }
        const data = result.data || result
        setResources(Array.isArray(data) ? data : [])
      } else {
        setResources([])
      }
    } catch (err) {
      console.error("Failed to fetch resources")
      setResources([])
    } finally {
      setLoading(false)
    }
  }

  const categories = ["all", "document", "guide", "news", "other"]
  const filteredResources =
    selectedCategory === "all" ? resources : resources.filter((r) => r.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gray-50">


      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Resources</h1>

        {/* Category Filter */}
        <div className="mb-8 flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-lg capitalize font-medium transition ${selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:border-blue-600"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No resources available in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredResources.map((resource) => (
              <div
                key={resource._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
              >
                <div className="flex gap-6 p-6">
                  {resource.thumbnail && (
                    <div className="relative w-40 h-40 flex-shrink-0">
                      <Image
                        src={resource.thumbnail || "/placeholder.svg"}
                        alt={resource.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover rounded-lg"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-2xl font-bold text-gray-800">{resource.title}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full capitalize">
                        {resource.category}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{resource.description}</p>
                    <p className="text-gray-700 mb-4">{resource.content}</p>
                    {resource.fileUrl && (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Download / View File
                      </a>
                    )}
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
