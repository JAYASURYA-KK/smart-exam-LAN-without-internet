import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { createUser } from "@/lib/auth"

export async function POST() {
  try {
    const db = await getDatabase()

    // Create indexes for better performance
    await db.collection("users").createIndex({ username: 1 }, { unique: true })
    await db.collection("users").createIndex({ studentId: 1 }, { unique: true, sparse: true })
    await db.collection("exams").createIndex({ status: 1 })
    await db.collection("exams").createIndex({ createdBy: 1 })
    await db.collection("submissions").createIndex({ studentId: 1, examId: 1 }, { unique: true })
    await db.collection("user_sessions").createIndex({ sessionToken: 1 })
    await db.collection("user_sessions").createIndex({ userId: 1 })
    await db.collection("user_sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

    // Check if admin user already exists
    const adminExists = await db.collection("users").findOne({ username: "admin" })

    if (!adminExists) {
      // Create default admin user
      await createUser({
        username: "admin",
        password: "admin123",
        fullName: "System Administrator",
        role: "teacher",
        isOnline: false,
      })

      // Create sample students
      await createUser({
        username: "student1",
        password: "student123",
        fullName: "John Doe",
        studentId: "STU001",
        role: "student",
        isOnline: false,
      })

      await createUser({
        username: "student2",
        password: "student123",
        fullName: "Jane Smith",
        studentId: "STU002",
        role: "student",
        isOnline: false,
      })

      await createUser({
        username: "student3",
        password: "student123",
        fullName: "Bob Johnson",
        studentId: "STU003",
        role: "student",
        isOnline: false,
      })
    }

    return NextResponse.json({
      message: "Database setup completed successfully",
      adminExists: !!adminExists,
    })
  } catch (error) {
    console.error("Setup error:", error)
    return NextResponse.json({ message: "Setup failed", error: error.message }, { status: 500 })
  }
}
