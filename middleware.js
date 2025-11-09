import { NextResponse } from "next/server"
import { verifyToken } from "./src/lib/auth"

export function middleware(request) {
  const { pathname } = request.nextUrl

  // Routes that require admin authentication
  const adminRoutes = [
    "/admin",
    "/admin/photo-gallery",
    "/admin/video-gallery",
    "/admin/resources",
    "/admin/volunteers",
  ]

  // Check if route requires authentication (exclude login page)
  const isProtectedRoute = adminRoutes.some((route) => pathname.startsWith(route) && pathname !== "/admin/login")

  if (isProtectedRoute) {
    const token = request.cookies.get("adminToken")?.value || request.headers.get("Authorization")?.split(" ")[1]

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }

    if (!verifyToken(token)) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
