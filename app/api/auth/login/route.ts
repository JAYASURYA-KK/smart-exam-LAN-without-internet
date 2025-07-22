import { type NextRequest, NextResponse } from "next/server"
import { findUserByUsername, verifyPassword, updateUserOnlineStatus, createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { username, password, role } = await request.json()

    if (!username || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Find user in database
    const user = await findUserByUsername(username)

    if (!user || user.role !== role) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 })
    }

    // Update user online status
    await updateUserOnlineStatus(user._id!, true)

    // Create session
    const ipAddress = request.ip || request.headers.get("x-forwarded-for") || "unknown"
    const userAgent = request.headers.get("user-agent") || "unknown"
    const sessionToken = await createSession(user._id!, ipAddress, userAgent)

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      token: sessionToken,
      user: {
        ...userWithoutPassword,
        _id: user._id!.toString(),
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
