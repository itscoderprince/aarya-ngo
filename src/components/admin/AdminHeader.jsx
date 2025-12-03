"use client"

import { useRouter } from "next/navigation"
import { LogOut, Bell, Search } from "lucide-react"

export default function AdminHeader({ title }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    router.push("/admin/login")
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="px-8 py-4 flex justify-between items-center">

        {/* Title / Breadcrumb */}
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {title || "Overview"}
          </h2>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Search Placeholder */}
          <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2 w-64">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none outline-none text-sm text-gray-600 w-full placeholder-gray-400"
            />
          </div>

          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          <div className="h-6 w-px bg-gray-200 mx-1"></div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
