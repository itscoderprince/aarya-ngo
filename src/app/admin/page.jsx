"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Image, Video, FileText, Users, Clock, ArrowRight, TrendingUp, Activity, CheckCircle, XCircle } from "lucide-react"

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({
    counts: {
      photos: 0,
      videos: 0,
      resources: 0,
      volunteers: 0,
      pendingVolunteers: 0,
    },
    recentActivity: {
      volunteers: []
    }
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
      const response = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 401) {
        localStorage.removeItem("adminToken")
        router.push("/admin/login")
        return
      }

      if (response.ok) {
        const result = await response.json()
        const data = result.data || result
        setStats(data)
      }
    } catch (err) {
      console.error("Failed to fetch stats:", err)
    } finally {
      setLoading(false)
    }
  }

  const dashboardCards = [
    {
      title: "Total Volunteers",
      icon: Users,
      count: stats.counts.volunteers,
      href: "/admin/volunteers",
      color: "bg-blue-500",
      textColor: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending Applications",
      icon: Clock,
      count: stats.counts.pendingVolunteers,
      href: "/admin/volunteers?status=pending",
      color: "bg-amber-500",
      textColor: "text-amber-500",
      bgColor: "bg-amber-50",
      highlight: stats.counts.pendingVolunteers > 0,
    },
    {
      title: "Photo Gallery",
      icon: Image,
      count: stats.counts.photos,
      href: "/admin/photo-gallery",
      color: "bg-purple-500",
      textColor: "text-purple-500",
      bgColor: "bg-purple-50",
    },
    {
      title: "Video Gallery",
      icon: Video,
      count: stats.counts.videos,
      href: "/admin/video-gallery",
      color: "bg-pink-500",
      textColor: "text-pink-500",
      bgColor: "bg-pink-50",
    },
    {
      title: "Resources",
      icon: FileText,
      count: stats.counts.resources,
      href: "/admin/resources",
      color: "bg-emerald-500",
      textColor: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#022741] mb-4"></div>
          <p className="text-gray-500 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-[#022741] mb-2">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back, Admin. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {dashboardCards.map((card) => {
          const Icon = card.icon
          return (
            <Link key={card.title} href={card.href}>
              <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group relative overflow-hidden h-full ${card.highlight ? 'ring-2 ring-amber-400' : ''}`}>

                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${card.bgColor} ${card.textColor}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {card.highlight && (
                    <span className="flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold text-gray-800">{card.count}</span>
                    <span className="text-xs text-gray-400 mb-1.5">items</span>
                  </div>
                </div>

                {/* Hover Effect Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* Recent Activity / New Volunteers */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#022741]" />
              <h2 className="text-lg font-bold text-[#022741]">Recent Volunteers</h2>
            </div>
            <Link href="/admin/volunteers" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentActivity.volunteers.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 text-sm">
                      No recent activity.
                    </td>
                  </tr>
                ) : (
                  stats.recentActivity.volunteers.map((volunteer) => (
                    <tr key={volunteer._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs overflow-hidden">
                            {volunteer.profilePicUrl ? (
                              <img src={volunteer.profilePicUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              volunteer.name.charAt(0)
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{volunteer.name}</p>
                            <p className="text-xs text-gray-500">{volunteer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                          {volunteer.validity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(volunteer.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${volunteer.status === 'approved' ? 'bg-green-100 text-green-700' :
                            volunteer.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                          }`}>
                          {volunteer.status === 'approved' && <CheckCircle className="w-3 h-3" />}
                          {volunteer.status === 'rejected' && <XCircle className="w-3 h-3" />}
                          {volunteer.status === 'pending' && <Clock className="w-3 h-3" />}
                          <span className="capitalize">{volunteer.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-[#022741]" />
            <h2 className="text-lg font-bold text-[#022741]">Quick Actions</h2>
          </div>

          <div className="space-y-3">
            <Link
              href="/admin/volunteers"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="bg-blue-100 p-3 rounded-lg text-blue-600 group-hover:bg-blue-200 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm group-hover:text-blue-700">Review Volunteers</p>
                <p className="text-xs text-gray-500">Approve pending requests</p>
              </div>
            </Link>

            <Link
              href="/admin/photo-gallery"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="bg-purple-100 p-3 rounded-lg text-purple-600 group-hover:bg-purple-200 transition-colors">
                <Image className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm group-hover:text-purple-700">Add Photo</p>
                <p className="text-xs text-gray-500">Update gallery images</p>
              </div>
            </Link>

            <Link
              href="/admin/video-gallery"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-pink-500 hover:bg-pink-50 transition-all group"
            >
              <div className="bg-pink-100 p-3 rounded-lg text-pink-600 group-hover:bg-pink-200 transition-colors">
                <Video className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm group-hover:text-pink-700">Add Video</p>
                <p className="text-xs text-gray-500">Update video content</p>
              </div>
            </Link>

            <Link
              href="/admin/resources"
              className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
            >
              <div className="bg-emerald-100 p-3 rounded-lg text-emerald-600 group-hover:bg-emerald-200 transition-colors">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm group-hover:text-emerald-700">Add Resource</p>
                <p className="text-xs text-gray-500">Upload documents</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
