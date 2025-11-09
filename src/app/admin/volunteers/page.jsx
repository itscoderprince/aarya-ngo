"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import VolunteerApplicationForm from "@/components/admin/VolunteerApplicationForm"

export default function AdminVolunteers() {
  const router = useRouter()
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVolunteer, setEditingVolunteer] = useState(null)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
    fetchVolunteers()
  }, [router])

  const fetchVolunteers = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const response = await fetch("/api/volunteers", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setVolunteers(data)
      }
    } catch (err) {
      setError("Failed to fetch volunteers")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const token = localStorage.getItem("adminToken")
      if (!editingVolunteer) {
        setError("Invalid operation")
        return
      }

      const response = await fetch(`/api/volunteers/${editingVolunteer._id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (response.ok) {
        setShowForm(false)
        setEditingVolunteer(null)
        fetchVolunteers()
      } else {
        setError("Failed to save volunteer")
      }
    } catch (err) {
      setError("An error occurred")
    }
  }

  const handleCreateNew = () => {
    setEditingVolunteer({
      name: "",
      dob: "",
      bloodGroup: "",
      address: "",
      mobile: "",
      validity: "1year",
      status: "approved",
      notes: "",
      isPublished: false,
    })
    setShowForm(true)
  }

  const filteredVolunteers = volunteers.filter((v) => {
    if (filter === "all") return true
    return v.status === filter
  })

  const getStatusBadge = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    }
    return colors[status] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Volunteer Management</h1>
          <div className="flex gap-2">
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Back
            </button>
            <button
              onClick={() => {
                setEditingVolunteer(null)
                setShowForm(!showForm)
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {showForm ? "Cancel" : "Create New"}
            </button>
          </div>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

        {showForm && editingVolunteer && (
          <div className="mb-8">
            <VolunteerApplicationForm
              volunteer={editingVolunteer}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false)
                setEditingVolunteer(null)
              }}
            />
          </div>
        )}

        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            All ({volunteers.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg ${
              filter === "pending" ? "bg-yellow-500 text-white" : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Pending ({volunteers.filter((v) => v.status === "pending").length})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg ${
              filter === "approved" ? "bg-green-500 text-white" : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Approved ({volunteers.filter((v) => v.status === "approved").length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredVolunteers.map((volunteer) => (
              <div key={volunteer._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{volunteer.name}</h3>
                    <p className="text-gray-600">{volunteer.mobile}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(volunteer.status)}`}>
                    {volunteer.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Blood Group</p>
                    <p className="font-semibold text-gray-800">{volunteer.bloodGroup}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Validity</p>
                    <p className="font-semibold text-gray-800">
                      {volunteer.validity === "1year"
                        ? "1 Year"
                        : volunteer.validity === "3year"
                          ? "3 Years"
                          : "Lifetime"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-semibold text-gray-800">₹{volunteer.amount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Published</p>
                    <p className="font-semibold text-gray-800">{volunteer.isPublished ? "Yes" : "No"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-gray-800">{volunteer.address}</p>
                  </div>
                  {volunteer.notes && (
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-gray-800">{volunteer.notes}</p>
                    </div>
                  )}
                </div>

                {volunteer.paymentReceiptUrl && (
                  <div className="mb-4">
                    <a
                      href={volunteer.paymentReceiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline text-sm"
                    >
                      View Payment Receipt
                    </a>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingVolunteer(volunteer)
                      setShowForm(true)
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
