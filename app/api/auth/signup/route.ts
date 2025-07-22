import { type NextRequest, NextResponse } from "next/server"
import { createUser, findUserByUsername } from "@/lib/auth"
import { getDatabase } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { username, password, fullName, studentId, role } = await request.json()

    if (!username || !password || !fullName || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    if (role === "student" && !studentId) {
      return NextResponse.json({ message: "Student ID is required for students" }, { status: 400 })
    }

    // Check if username already exists
    const existingUser = await findUserByUsername(username)
    if (existingUser) {
      return NextResponse.json({ message: "Username already exists" }, { status: 400 })
    }

    // Check if student ID already exists (for students)
    if (role === "student") {
      const db = await getDatabase()
      const existingStudentId = await db.collection("users").findOne({ studentId })
      if (existingStudentId) {
        return NextResponse.json({ message: "Student ID already exists" }, { status: 400 })
      }
    }

    // Create new user
    const userId = await createUser({
      username,
      password,
      fullName,
      studentId: role === "student" ? studentId : undefined,
      role,
      isOnline: false,
    })

    return NextResponse.json(
      {
        message: "User created successfully",
        userId: userId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
