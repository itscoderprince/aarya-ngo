"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    photos: 0,
    videos: 0,
    resources: 0,
    volunteers: 0,
    pendingVolunteers: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
    fetchStats()
  }, [router])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch all resources simultaneously
      const [photos, videos, resources, volunteers] = await Promise.all([
        fetch("/api/photo-gallery", { headers }).then((r) => r.json()),
        fetch("/api/video-gallery", { headers }).then((r) => r.json()),
        fetch("/api/resources", { headers }).then((r) => r.json()),
        fetch("/api/volunteers?all=true", { headers }).then((r) => r.json()),
      ])

      setStats({
        photos: Array.isArray(photos) ? photos.length : 0,
        videos: Array.isArray(videos) ? videos.length : 0,
        resources: Array.isArray(resources) ? resources.length : 0,
        volunteers: Array.isArray(volunteers) ? volunteers.length : 0,
        pendingVolunteers: Array.isArray(volunteers)
          ? volunteers.filter((v) => v.status === "pending").length
          : 0,
      })
    } catch (err) {
      console.error("Failed to fetch stats:", err)
    } finally {
      setLoading(false)
    }
  }

  const dashboardCards = [
    {
      title: "Photo Gallery",
      icon: "📸",
      count: stats.photos,
      href: "/admin/photo-gallery",
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Video Gallery",
      icon: "🎥",
      count: stats.videos,
      href: "/admin/video-gallery",
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Resources",
      icon: "📚",
      count: stats.resources,
      href: "/admin/resources",
      color: "from-green-500 to-green-600",
    },
    {
      title: "Total Volunteers",
      icon: "👥",
      count: stats.volunteers,
      href: "/admin/volunteers",
      color: "from-orange-500 to-orange-600",
    },
    {
      title: "Pending Applications",
      icon: "⏳",
      count: stats.pendingVolunteers,
      href: "/admin/volunteers",
      color: "from-red-500 to-red-600",
      highlight: stats.pendingVolunteers > 0,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Admin Panel</h1>
        <p className="text-gray-600">Manage your website content and volunteer applications</p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {dashboardCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <div
              className={`bg-gradient-to-br ${card.color} text-white rounded-lg p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition cursor-pointer ${
                card.highlight ? "ring-2 ring-offset-2 ring-red-300" : ""
              }`}
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <h3 className="text-sm font-medium opacity-90 mb-1">{card.title}</h3>
              <p className="text-3xl font-bold">{card.count}</p>
              {card.highlight && <p className="text-xs mt-2 font-semibold">Action needed!</p>}
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/admin/photo-gallery"
            className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
          >
            <p className="font-semibold text-blue-900">Add Photo</p>
            <p className="text-sm text-blue-700">Add new photo to gallery</p>
          </Link>
          <Link
            href="/admin/video-gallery"
            className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition"
          >
            <p className="font-semibold text-purple-900">Add Video</p>
            <p className="text-sm text-purple-700">Add new video to gallery</p>
          </Link>
          <Link
            href="/admin/resources"
            className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition"
          >
            <p className="font-semibold text-green-900">Add Resource</p>
            <p className="text-sm text-green-700">Add new resource or document</p>
          </Link>
          <Link
            href="/admin/volunteers"
            className="p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition"
          >
            <p className="font-semibold text-orange-900">Review Volunteers</p>
            <p className="text-sm text-orange-700">Manage volunteer applications</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
