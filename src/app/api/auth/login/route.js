import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { verifyAdminCredentials, generateToken } from "@/lib/auth"

export async function POST(request) {
  try {
    await connectDB()

    const { username, password } = await request.json()

    console.log("[v0] Login attempt - username:", username)

    if (!verifyAdminCredentials(username, password)) {
      console.log("[v0] Invalid credentials for user:", username)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken(username)
    console.log("[v0] Token generated successfully for:", username)

    const response = NextResponse.json({ success: true, token })
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
    })

    return response
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
