import jwt from "jsonwebtoken"
import { NextResponse } from "next/server"

function generateToken(username) {
  return jwt.sign({ username, type: "admin" }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  })
}

function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function withAdminAuth(handler) {
  return async (request, context) => {
    let token = request.cookies.get("adminToken")?.value

    if (!token) {
      const authHeader = request.headers.get("authorization")
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7)
      }
    }

    if (!token) {
      console.log("[v0] No token provided")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const verified = verifyToken(token)
    if (!verified) {
      console.log("[v0] Token verification failed")
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
    }

    return handler(request, context)
  }
}

export { generateToken, verifyToken }
