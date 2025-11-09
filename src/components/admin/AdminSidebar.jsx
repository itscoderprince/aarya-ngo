"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: "📊",
      isActive: pathname === "/admin",
    },
    {
      href: "/admin/photo-gallery",
      label: "Photo Gallery",
      icon: "📸",
      isActive: pathname.includes("photo-gallery"),
    },
    {
      href: "/admin/video-gallery",
      label: "Video Gallery",
      icon: "🎥",
      isActive: pathname.includes("video-gallery"),
    },
    {
      href: "/admin/resources",
      label: "Resources",
      icon: "📚",
      isActive: pathname.includes("resources"),
    },
    {
      href: "/admin/volunteers",
      label: "Volunteers",
      icon: "👥",
      isActive: pathname.includes("volunteers"),
    },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-white h-screen sticky top-0 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              item.isActive ? "bg-blue-600 text-white font-semibold" : "hover:bg-gray-800 text-gray-300"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  )
}
