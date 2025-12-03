"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import debounce from "lodash/debounce"
import {
  Search, Download, Phone, MapPin, Droplet, User, Plus, ChevronLeft, ChevronRight, Loader2
} from "lucide-react"

// Color constants
const COLORS = {
  navy: 'rgb(2, 39, 65)',
  yellow: 'rgb(255, 183, 11)',
}

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  // Pagination State
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1
  })

  // Debounced Search
  const debouncedSearch = useCallback(
    debounce((query) => {
      setPagination(prev => ({ ...prev, page: 1 })) // Reset to page 1 on search
      fetchVolunteers(1, query)
    }, 500),
    []
  )

  useEffect(() => {
    fetchVolunteers(pagination.page, searchQuery)
  }, [pagination.page])

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value)
    debouncedSearch(e.target.value)
  }

  const fetchVolunteers = async (page = 1, search = "") => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams({
        mode: "public",
        page: page.toString(),
        limit: "15",
        search: search
      })

      const response = await fetch(`/api/volunteers?${queryParams.toString()}`)

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
          setVolunteers([])
        }
      } else {
        setVolunteers([])
      }
    } catch (err) {
      console.error("Failed to fetch volunteers:", err)
      setVolunteers([])
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async (volunteerId, type) => {
    try {
      const response = await fetch(`/api/volunteers/download-pdf?volunteerId=${volunteerId}&type=${type}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `${volunteerId}_${type}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (err) {
      console.error("Download error:", err)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-[1600px] mx-auto">

        {/* TOP TOOLBAR */}
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-10">

          <div className="flex items-center gap-3">
            <div className="h-8 w-2 rounded-full" style={{ backgroundColor: COLORS.yellow }}></div>
            <h2 className="text-3xl font-bold" style={{ color: COLORS.navy }}>
              All Volunteers ({pagination.total})
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 sm:w-96 shadow-sm rounded-lg bg-white">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by Name, ID, Email..."
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:border-transparent text-base"
                style={{ '--tw-ring-color': COLORS.navy }}
              />
            </div>

            <Link
              href="/apply-volunteer"
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 whitespace-nowrap"
              style={{ backgroundColor: COLORS.yellow, color: COLORS.navy }}
            >
              <Plus className="w-5 h-5" />
              <span>Join Now</span>
            </Link>
          </div>
        </div>

        {/* MAIN GRID */}
        <div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm h-96 animate-pulse border border-gray-200">
                  <div className="h-24 bg-gray-200 rounded-t-2xl"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto -mt-16 border-4 border-white"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mt-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="inline-block p-6 rounded-full bg-gray-50 mb-6">
                <div className="text-gray-300"><User className="w-16 h-16" /></div>
              </div>
              <p className="text-gray-500 text-xl font-medium">No volunteers found matching your criteria.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-10">
                {volunteers.map((volunteer) => (
                  <VolunteerCard key={volunteer._id} volunteer={volunteer} downloadPDF={downloadPDF} />
                ))}
              </div>

              {/* PAGINATION */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm font-medium text-gray-700"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>

                  <span className="text-sm font-medium text-gray-600">
                    Page <span className="text-gray-900 font-bold">{pagination.page}</span> of {pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.totalPages, prev.page + 1) }))}
                    disabled={pagination.page >= pagination.totalPages}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm font-medium text-gray-700"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}

// --- NEW PROFESSIONAL CARD DESIGN ---
function VolunteerCard({ volunteer, downloadPDF }) {
  const isLifetime = volunteer.validity === "lifetime";

  return (
    <div className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100">

      {/* 1. HEADER BANNER (Navy Blue) */}
      <div className="h-24 w-full relative" style={{ backgroundColor: COLORS.navy }}>
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {isLifetime ? (
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-[#FFB70B] text-[#022741] shadow-sm uppercase tracking-wide">
              Lifetime
            </span>
          ) : (
            <span className="text-[10px] font-bold px-2 py-1 rounded bg-white/20 text-white backdrop-blur-sm shadow-sm uppercase tracking-wide">
              Member
            </span>
          )}
        </div>
        {/* ID Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <span className="text-[10px] text-gray-300 uppercase tracking-widest">Member ID:</span>
          <span className="text-xs font-mono font-bold text-white tracking-wide">
            {volunteer.volunteerId || '000'}
          </span>
        </div>
      </div>

      {/* 2. AVATAR (Overlapping) */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <div className="w-28 h-28 rounded-full p-1 bg-white shadow-lg">
          <div className="w-full h-full rounded-full overflow-hidden bg-gray-50 relative">
            {volunteer.profilePicUrl ? (
              <img
                src={volunteer.profilePicUrl || "/placeholder.svg"}
                alt={volunteer.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <User className="w-12 h-12" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. BODY CONTENT */}
      <div className="pt-16 pb-6 px-6 flex flex-col flex-grow text-center">

        {/* Name & Email */}
        <div className="mb-6">
          <h3 className="text-xl font-bold leading-tight mb-1" style={{ color: COLORS.navy }}>
            {volunteer.name}
          </h3>
          <p className="text-sm text-gray-500 font-medium truncate px-2">{volunteer.email}</p>
        </div>

        {/* Info Grid (Compacts the empty space) */}
        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 flex-grow flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4 mb-3 border-b border-gray-200 pb-3">
            {/* Phone */}
            <div className="flex flex-col items-center">
              <div className="text-gray-400 mb-1"><Phone className="w-4 h-4" /></div>
              <span className="text-xs font-bold text-gray-700">{volunteer.mobile}</span>
            </div>
            {/* Blood Group */}
            <div className="flex flex-col items-center border-l border-gray-200 pl-4">
              <div className="text-red-500 mb-1"><Droplet className="w-4 h-4" /></div>
              <span className="text-xs font-bold text-gray-700">{volunteer.bloodGroup}</span>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <div style={{ color: COLORS.navy }}><MapPin className="w-4 h-4" /></div>
            <span className="text-xs font-medium line-clamp-1 text-left">{volunteer.address}</span>
          </div>
        </div>

        {/* Action Buttons (Full width look) */}
        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button
            onClick={() => downloadPDF(volunteer.volunteerId, "id-card")}
            className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg bg-white border hover:bg-gray-50 transition-colors group"
            style={{ borderColor: 'rgba(2,39,65,0.2)' }}
          >
            <div className="text-gray-500 group-hover:text-[#022741] transition-colors"><User className="w-4 h-4" /></div>
            <span className="text-xs font-bold text-gray-600 group-hover:text-[#022741]">ID Card</span>
          </button>

          <button
            onClick={() => downloadPDF(volunteer.volunteerId, "certificate")}
            className="flex items-center justify-center gap-2 py-2.5 px-2 rounded-lg transition-colors shadow-sm hover:shadow-md hover:brightness-105"
            style={{ backgroundColor: COLORS.yellow }}
          >
            <div style={{ color: COLORS.navy }}><Download className="w-4 h-4" /></div>
            <span className="text-xs font-bold" style={{ color: COLORS.navy }}>Certificate</span>
          </button>
        </div>

      </div>
    </div>
  )
}