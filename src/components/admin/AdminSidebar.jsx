"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Image, Video, FileText, Users, Settings, LogOut } from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const menuItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      href: "/admin/photo-gallery",
      label: "Photo Gallery",
      icon: Image,
      isActive: pathname.includes("photo-gallery"),
    },
    {
      href: "/admin/video-gallery",
      label: "Video Gallery",
      icon: Video,
      isActive: pathname.includes("video-gallery"),
    },
    {
      href: "/admin/resources",
      label: "Resources",
      icon: FileText,
      isActive: pathname.includes("resources"),
    },
    {
      href: "/admin/volunteers",
      label: "Volunteers",
      icon: Users,
      isActive: pathname.includes("volunteers"),
    },
  ]

  return (
    <aside className="w-64 bg-[#022741] text-white h-screen sticky top-0 flex flex-col shadow-xl z-20">
      {/* Brand */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">
          AARYA <span className="text-[#FFB70B]">ADMIN</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${item.isActive
                  ? "bg-[#FFB70B] text-[#022741] font-bold shadow-md"
                  : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
            >
              <Icon className={`w-5 h-5 ${item.isActive ? "text-[#022741]" : "text-gray-400 group-hover:text-white"}`} />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Footer / User Info */}
      <div className="p-4 border-t border-white/10 bg-[#011c2e]">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-[#FFB70B] flex items-center justify-center text-[#022741] font-bold text-xs">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-gray-400 truncate">admin@aarya.org</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
