"use client"

import { useEffect, useState, useMemo, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search, Plus, Filter, Download, MoreVertical,
  CheckCircle, XCircle, Clock, Trash2, Eye, Edit,
  ChevronLeft, ChevronRight, Users, Loader2, MoreHorizontal,
  Phone, Hash, Shield
} from "lucide-react"
import { toast } from "react-hot-toast"
import VolunteerApplicationForm from "@/components/admin/VolunteerApplicationForm"
import VolunteerDetailModal from "@/components/admin/VolunteerDetailModal"
import debounce from "lodash/debounce"

export default function AdminVolunteers() {
  const router = useRouter()
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVolunteer, setEditingVolunteer] = useState(null)
  const [viewingVolunteer, setViewingVolunteer] = useState(null)

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  // Action Loading States
  const [actionLoading, setActionLoading] = useState(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")

  // Dropdown State
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const dropdownRef = useRef(null)

  // Debounced Search
  const debouncedSearch = useCallback(
    debounce((query) => {
      setPagination(prev => ({ ...prev, page: 1 })) // Reset to page 1 on search
      fetchVolunteers(1, query, statusFilter, planFilter)
    }, 500),
    [statusFilter, planFilter]
  )

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("adminToken")
      if (!token) {
        router.push("/admin/login")
        return
      }
      fetchVolunteers(pagination.page, searchQuery, statusFilter, planFilter)
    }
    checkAuth()
  }, [pagination.page, statusFilter, planFilter]) // Trigger on page/filter change

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getToken = () => localStorage.getItem("adminToken") || ""

  const fetchVolunteers = async (page = 1, search = "", status = "all", validity = "all") => {
    try {
      setLoading(true)
      const token = getToken()

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search,
        status,
        validity
      })

      const response = await fetch(`/api/volunteers?${queryParams.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      })

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result

        if (data.volunteers) {
          setVolunteers(data.volunteers)
          setPagination(prev => ({
            ...prev,
            total: data.pagination.total,
            totalPages: data.pagination.totalPages,
            page: data.pagination.page
          }))
        } else {
          // Fallback if API structure is different
          setVolunteers(Array.isArray(data) ? data : [])
        }
      } else if (response.status === 401) {
        localStorage.removeItem("adminToken")
        router.push("/admin/login")
      } else {
        toast.error("Failed to fetch volunteers")
        setVolunteers([])
      }
    } catch (err) {
      console.log("[v0] Fetch volunteers error:", err)
      toast.error("Failed to fetch volunteers")
      setVolunteers([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (formData) => {
    const toastId = toast.loading("Saving volunteer...")
    try {
      const token = getToken()
      const url = editingVolunteer && editingVolunteer._id
        ? `/api/volunteers/${editingVolunteer._id}`
        : "/api/volunteers"

      const method = editingVolunteer && editingVolunteer._id ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        toast.success(editingVolunteer ? "Volunteer updated successfully" : "Volunteer created successfully", { id: toastId })
        setShowForm(false)
        setEditingVolunteer(null)
        fetchVolunteers(pagination.page, searchQuery, statusFilter, planFilter)
      } else {
        toast.error(result.message || "Operation failed", { id: toastId })
      }
    } catch (err) {
      toast.error("An error occurred", { id: toastId })
    }
  }

  const handleStatusChange = async (id, newStatus) => {
    setActionLoading(id)
    const toastId = toast.loading(`Updating status to ${newStatus}...`)
    try {
      const token = getToken()
      const response = await fetch(`/api/volunteers/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast.success("Status updated successfully", { id: toastId })
        fetchVolunteers(pagination.page, searchQuery, statusFilter, planFilter)
        setOpenDropdownId(null)
      } else {
        toast.error("Failed to update status", { id: toastId })
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred", { id: toastId })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volunteer?")) return

    setActionLoading(id)
    const toastId = toast.loading("Deleting volunteer...")
    try {
      const token = getToken()
      const response = await fetch(`/api/volunteers/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        toast.success("Volunteer deleted successfully", { id: toastId })
        fetchVolunteers(pagination.page, searchQuery, statusFilter, planFilter)
        setOpenDropdownId(null)
      } else {
        toast.error("Failed to delete", { id: toastId })
      }
    } catch (err) {
      console.error(err)
      toast.error("An error occurred", { id: toastId })
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-700 border-green-200'
      case 'rejected': return 'bg-red-100 text-red-700 border-red-200'
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      {viewingVolunteer && (
        <VolunteerDetailModal volunteer={viewingVolunteer} onClose={() => setViewingVolunteer(null)} />
      )}

      {showForm ? (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-[#022741]">
                {editingVolunteer ? "Edit Volunteer" : "New Volunteer Registration"}
              </h2>
              <p className="text-sm text-gray-500">Fill in the details below.</p>
            </div>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600 transition p-2 hover:bg-gray-50 rounded-full">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
          <VolunteerApplicationForm
            volunteer={editingVolunteer || {}}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
            isAdminCreate={!editingVolunteer?._id}
          />
        </div>
      ) : (
        <>
          {/* Unified Toolbar - Sticky & Full Width */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-4 items-center justify-between sticky top-0 z-30 w-full backdrop-blur-xl bg-white/95 supports-[backdrop-filter]:bg-white/80">

            {/* Left: Title & Add Button */}
            <div className="flex items-center gap-4 w-full xl:w-auto">
              <div className="bg-blue-50 p-2.5 rounded-xl text-[#022741]">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#022741]">Volunteers</h1>
                <p className="text-xs text-gray-500">{pagination.total} records found</p>
              </div>
              <div className="h-8 w-px bg-gray-200 mx-2 hidden sm:block"></div>
              <button
                onClick={() => {
                  setEditingVolunteer(null)
                  setShowForm(true)
                }}
                className="flex items-center gap-2 bg-[#022741] text-white px-4 py-2.5 rounded-xl hover:bg-[#033a61] transition shadow-lg shadow-blue-900/10 font-medium text-sm whitespace-nowrap ml-auto sm:ml-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New</span>
              </button>
            </div>

            {/* Right: Search & Filters */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search volunteers..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition text-sm"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value)
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className="flex-1 sm:flex-none px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer text-sm font-medium"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>

                <select
                  value={planFilter}
                  onChange={(e) => {
                    setPlanFilter(e.target.value)
                    setPagination(prev => ({ ...prev, page: 1 }))
                  }}
                  className="flex-1 sm:flex-none px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer text-sm font-medium"
                >
                  <option value="all">All Plans</option>
                  <option value="1year">1 Year</option>
                  <option value="3year">3 Years</option>
                  <option value="lifetime">Lifetime</option>
                  <option value="free">Free</option>
                </select>

                <button className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl border border-gray-200 transition" title="Export CSV">
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px] flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[25%]">Volunteer Profile</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%]">Contact</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%]">Plan Details</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[10%]">ID</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[10%]">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[15%]">Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-[10%] text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center text-gray-500">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-3"></div>
                        <p className="text-sm">Loading data...</p>
                      </td>
                    </tr>
                  ) : volunteers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-20 text-center text-gray-500 text-sm">
                        No volunteers found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    volunteers.map((volunteer) => (
                      <tr key={volunteer._id} className="hover:bg-blue-50/30 transition-colors group">
                        {/* Profile */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200 shadow-sm">
                              {volunteer.profilePicUrl ? (
                                <img src={volunteer.profilePicUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Users className="w-4 h-4" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-gray-900 text-sm truncate">{volunteer.name}</p>
                              <p className="text-xs text-gray-500 truncate">{volunteer.email}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            <span className="text-sm font-medium">{volunteer.mobile}</span>
                          </div>
                        </td>

                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded border border-gray-200 whitespace-nowrap">
                            {volunteer.volunteerId || "N/A"}
                          </span>
                        </td>

                        {/* Plan */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-bold text-[#022741] flex items-center gap-1.5">
                              <Shield className="w-3.5 h-3.5 text-blue-500" />
                              {volunteer.validity === 'free' ? 'Free' : `${volunteer.validity}`}
                            </span>
                            {volunteer.amount > 0 && (
                              <span className="text-xs text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded w-fit">
                                ₹{volunteer.amount}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(volunteer.status)}`}>
                            {volunteer.status}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-700 font-medium">
                            {new Date(volunteer.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(volunteer.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>

                        {/* Actions (Dropdown) */}
                        <td className="px-6 py-4 text-center relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenDropdownId(openDropdownId === volunteer._id ? null : volunteer._id)
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          >
                            {actionLoading === volunteer._id ? (
                              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                            ) : (
                              <MoreHorizontal className="w-5 h-5" />
                            )}
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdownId === volunteer._id && (
                            <div
                              ref={dropdownRef}
                              className="absolute right-8 top-8 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    setViewingVolunteer(volunteer)
                                    setOpenDropdownId(null)
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Eye className="w-4 h-4 text-gray-400" /> View Details
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingVolunteer(volunteer)
                                    setShowForm(true)
                                    setOpenDropdownId(null)
                                  }}
                                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Edit className="w-4 h-4 text-gray-400" /> Edit
                                </button>

                                {volunteer.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleStatusChange(volunteer._id, 'approved')}
                                      className="w-full text-left px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                                    >
                                      <CheckCircle className="w-4 h-4" /> Approve
                                    </button>
                                    <button
                                      onClick={() => handleStatusChange(volunteer._id, 'rejected')}
                                      className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                    >
                                      <XCircle className="w-4 h-4" /> Reject
                                    </button>
                                  </>
                                )}

                                <div className="h-px bg-gray-100 my-1"></div>
                                <button
                                  onClick={() => handleDelete(volunteer._id)}
                                  className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Pagination */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center text-gray-500 bg-gray-50/50">
              <p className="text-sm">
                Showing <span className="font-bold text-gray-900">{volunteers.length}</span> of <span className="font-bold text-gray-900">{pagination.total}</span> results
              </p>
              <div className="flex items-center gap-4">
                <span className="text-xs font-medium">Page {pagination.page} of {pagination.totalPages}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition border border-gray-200 bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent transition border border-gray-200 bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
