"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"

export default function AdminHeader({ title }) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    router.push("/admin/login")
  }

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-2xl font-bold hover:text-blue-100">
            AARYA Admin
          </Link>
          {title && <span className="text-blue-100">/ {title}</span>}
        </div>
        <button onClick={handleLogout} className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition">
          Logout
        </button>
      </div>
    </header>
  )
}
