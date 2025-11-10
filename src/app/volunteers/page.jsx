"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState([])
  const [loading, setLoading] = useState(true)

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

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading volunteers...</p>
          </div>
        ) : volunteers.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-600 text-lg">No volunteers yet. Be the first to join!</p>
            <Link
              href="/apply-volunteer"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition mt-4"
            >
              Apply Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers.map((volunteer) => (
              <div
                key={volunteer._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
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
                      {volunteer.validity === "1year"
                        ? "1 Year"
                        : volunteer.validity === "3year"
                          ? "3 Years"
                          : "Lifetime"}
                    </p>
                    {volunteer.approvalDate && (
                      <p className="text-gray-600">
                        <span className="font-semibold">Joined:</span>{" "}
                        {new Date(volunteer.approvalDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-blue-900 font-semibold">Dedicated Volunteer</p>
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
