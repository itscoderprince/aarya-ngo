"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import ResourceForm from "@/components/admin/ResourceForm"
import Image from "next/image"

export default function AdminResources() {
  const router = useRouter()
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingResource, setEditingResource] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
    fetchResources()
  }, [router])

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources", {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        setResources(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      setError("Failed to fetch resources")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("adminToken")
      const url = editingResource ? `/api/resources/${editingResource._id}` : "/api/resources"
      const method = editingResource ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (response.ok) {
        setShowForm(false)
        setEditingResource(null)
        fetchResources()
      } else {
        setError("Failed to save resource")
      }
    } catch (err) {
      setError("An error occurred")
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return

    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch(`/api/resources/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        fetchResources()
      } else {
        setError("Failed to delete resource")
      }
    } catch (err) {
      setError("An error occurred")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Resources</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={() => {
                setEditingResource(null)
                setShowForm(!showForm)
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {showForm ? "Cancel" : "Add Resource"}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {showForm && (
          <div className="mb-8">
            <ResourceForm
              resource={editingResource}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingResource(null)
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {resources.map((resource) => (
              <div key={resource._id} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <div className="flex gap-4 p-4">
                  {resource.thumbnail && (
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <Image
                        src={resource.thumbnail || "/placeholder.svg"}
                        alt={resource.title}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{resource.title}</h3>
                    <p className="text-gray-600 mb-2">{resource.description}</p>
                    <div className="flex gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded">{resource.category}</span>
                    </div>
                    {resource.fileUrl && (
                      <a
                        href={resource.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline text-sm mb-3 inline-block"
                      >
                        View File
                      </a>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingResource(resource)
                          setShowForm(true)
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(resource._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
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
