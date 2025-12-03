"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import AdminHeader from "@/components/admin/AdminHeader"
import AdminSidebar from "@/components/admin/AdminSidebar"

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Skip auth check for login page
    if (pathname === "/admin/login") {
      setLoading(false)
      return
    }

    const token = localStorage.getItem("adminToken")
    if (token) {
      setIsAuthenticated(true)
    } else {
      router.push("/admin/login")
    }
    setLoading(false)
  }, [mounted, router, pathname])

  if (!mounted) {
    return <div className="bg-white" />
  }

  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-auto p-4">{children}</main>
      </div>
    </div>
  )
}
