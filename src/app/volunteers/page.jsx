"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchId, setSearchId] = useState("")
  const [searchResult, setSearchResult] = useState(null)
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    fetchVolunteers()
  }, [])

  const fetchVolunteers = async () => {
    try {
      const response = await fetch("/api/volunteers")
      if (response.ok) {
        const data = await response.json()
        setVolunteers(data)
      }
    } catch (err) {
      console.error("Failed to fetch volunteers:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchId.trim()) {
      setSearchResult(null)
      return
    }

    setSearching(true)
    try {
      const response = await fetch(`/api/volunteers?volunteerId=${searchId}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResult(data)
      } else {
        setSearchResult(null)
        alert("Volunteer not found")
      }
    } catch (err) {
      console.error("Search error:", err)
      setSearchResult(null)
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchId("")
    setSearchResult(null)
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Our Volunteers</h1>
            <p className="text-gray-600">Meet our dedicated team members</p>
          </div>
          <Link
            href="/volunteers/apply"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Become a Volunteer
          </Link>
        </div>

        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Search Volunteer by ID</h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Volunteer ID (e.g., VOL-123456-789)"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {searching ? "Searching..." : "Search"}
            </button>
            {searchResult && (
              <button
                type="button"
                onClick={clearSearch}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
              >
                Clear
              </button>
            )}
          </form>
        </div>

        {searchResult && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Search Result</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <VolunteerCard volunteer={searchResult} downloadPDF={downloadPDF} />
            </div>
          </div>
        )}

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Volunteers ({volunteers.length})</h2>
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading volunteers...</p>
            </div>
          ) : volunteers.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600 text-lg">No volunteers yet. Be the first to join!</p>
              <Link
                href="/volunteers/apply"
                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition mt-4"
              >
                Apply Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {volunteers.map((volunteer) => (
                <VolunteerCard key={volunteer._id} volunteer={volunteer} downloadPDF={downloadPDF} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function VolunteerCard({ volunteer, downloadPDF }) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
      {volunteer.profilePicUrl && (
        <div className="h-48 bg-gray-200 overflow-hidden">
          <img
            src={volunteer.profilePicUrl || "/placeholder.svg"}
            alt={volunteer.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{volunteer.name}</h3>

        <div className="space-y-2 mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">ID:</span> {volunteer.volunteerId}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Contact:</span> {volunteer.mobile}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Blood Group:</span> {volunteer.bloodGroup}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Location:</span> {volunteer.address}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Membership:</span>{" "}
            {volunteer.validity === "1year" ? "1 Year" : volunteer.validity === "3year" ? "3 Years" : "Lifetime"}
          </p>
          {volunteer.approvalDate && (
            <p className="text-gray-600">
              <span className="font-semibold">Joined:</span> {new Date(volunteer.approvalDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => downloadPDF(volunteer.volunteerId, "id-card")}
            className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition text-sm font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            ID Card
          </button>
          <button
            onClick={() => downloadPDF(volunteer.volunteerId, "certificate")}
            className="flex-1 bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition text-sm font-semibold flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Certificate
          </button>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-900 font-semibold">Dedicated Volunteer</p>
        </div>
      </div>
    </div>
  )
}
