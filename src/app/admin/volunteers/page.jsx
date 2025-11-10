"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import VolunteerApplicationForm from "@/components/admin/VolunteerApplicationForm"
import VolunteerDetailModal from "@/components/admin/VolunteerDetailModal"

export default function AdminVolunteers() {
  const router = useRouter()
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVolunteer, setEditingVolunteer] = useState(null)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [viewingVolunteer, setViewingVolunteer] = useState(null)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        router.push("/admin/login")
        return
      }
      fetchVolunteers()
    }
    checkAuth()
  }, [router])

  const getToken = () => {
    return localStorage.getItem("adminToken") || ""
  }

  const fetchVolunteers = async () => {
    try {
      setLoading(true)
      const token = getToken()

      const response = await fetch("/api/volunteers?all=true", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (response.ok) {
        const data = await response.json()
        setVolunteers(Array.isArray(data) ? data : [])
        setError("")
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken")
        router.push("/admin/login")
      } else {
        setError("Failed to fetch volunteers")
        setVolunteers([])
      }
    } catch (err) {
      console.log("[v0] Fetch volunteers error:", err)
      setError("Failed to fetch volunteers")
      setVolunteers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    try {
      const token = getToken()

      if (editingVolunteer && editingVolunteer._id) {
        const response = await fetch(`/api/volunteers/${editingVolunteer._id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        const data = await response.json()

        if (response.ok) {
          setShowForm(false)
          setEditingVolunteer(null)
          setError("")
          fetchVolunteers()
        } else if (response.status === 401) {
          localStorage.removeItem("adminToken")
          router.push("/admin/login")
        } else {
          setError(data.error || "Failed to save volunteer")
        }
      } else {
        const response = await fetch("/api/volunteers", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })

        const data = await response.json()

        if (response.ok) {
          setShowForm(false)
          setEditingVolunteer(null)
          setError("")
          fetchVolunteers()
        } else if (response.status === 401) {
          localStorage.removeItem("adminToken")
          router.push("/admin/login")
        } else {
          setError(data.error || "Failed to create volunteer")
        }
      }
    } catch (err) {
      console.log("[v0] Submit volunteer error:", err)
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
      profilePicUrl: null,
    })
    setShowForm(true)
  }

  const handleApprove = async (id) => {
    try {
      const token = getToken()
      const response = await fetch(`/api/volunteers/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "approved" }),
      })

      const data = await response.json()

      if (response.ok) {
        setError("")
        fetchVolunteers()
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken")
        router.push("/admin/login")
      } else {
        setError(data.error || "Failed to approve volunteer")
      }
    } catch (err) {
      console.log("[v0] Approve error:", err)
      setError("An error occurred while approving: " + err.message)
    }
  }

  const handleReject = async (id) => {
    try {
      const token = getToken()
      const response = await fetch(`/api/volunteers/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "rejected" }),
      })

      const data = await response.json()

      if (response.ok) {
        setError("")
        fetchVolunteers()
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken")
        router.push("/admin/login")
      } else {
        setError(data.error || "Failed to reject volunteer")
      }
    } catch (err) {
      console.log("[v0] Reject error:", err)
      setError("An error occurred while rejecting: " + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volunteer?")) return

    try {
      const token = getToken()
      const response = await fetch(`/api/volunteers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setError("")
        fetchVolunteers()
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken")
        router.push("/admin/login")
      } else {
        setError(data.error || "Failed to delete volunteer")
      }
    } catch (err) {
      console.log("[v0] Delete error:", err)
      setError("An error occurred while deleting: " + err.message)
    }
  }

  const handleEdit = (volunteer) => {
    setEditingVolunteer(volunteer)
    setShowForm(true)
  }

  const handleViewDetails = (volunteer) => {
    setViewingVolunteer(volunteer)
  }

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminTokenTime")
    router.push("/admin/login")
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
      {viewingVolunteer && (
        <VolunteerDetailModal volunteer={viewingVolunteer} onClose={() => setViewingVolunteer(null)} />
      )}

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
            <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
              Logout
            </button>
            <button
              onClick={() => {
                if (showForm) {
                  setShowForm(false)
                  setEditingVolunteer(null)
                } else {
                  handleCreateNew()
                }
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
              isAdminCreate={!editingVolunteer._id}
            />
          </div>
        )}

        <div className="mb-6 flex gap-2 flex-wrap">
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
          <button
            onClick={() => setFilter("rejected")}
            className={`px-4 py-2 rounded-lg ${
              filter === "rejected" ? "bg-red-500 text-white" : "bg-white text-gray-700 border border-gray-300"
            }`}
          >
            Rejected ({volunteers.filter((v) => v.status === "rejected").length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredVolunteers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No volunteers found</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredVolunteers.map((volunteer) => (
              <div key={volunteer._id} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-4">
                    {volunteer.profilePicUrl && (
                      <img
                        src={volunteer.profilePicUrl || "/placeholder.svg"}
                        alt={volunteer.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{volunteer.name}</h3>
                      <p className="text-gray-600">{volunteer.mobile}</p>
                    </div>
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

                <div className="flex flex-wrap gap-2">
                  {volunteer.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(volunteer._id)}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(volunteer._id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleViewDetails(volunteer)}
                    className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleEdit(volunteer)}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(volunteer._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                  >
                    Delete
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
