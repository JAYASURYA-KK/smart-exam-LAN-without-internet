import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { User } from "@/lib/models/User"

export async function GET() {
  try {
    const db = await getDatabase()
    const students = await db.collection<User>("users").find({ role: "student" }).sort({ fullName: 1 }).toArray()

    const studentsWithoutPassword = students.map((student) => {
      const { password, ...studentData } = student
      return {
        ...studentData,
        _id: student._id!.toString(),
      }
    })

    return NextResponse.json(studentsWithoutPassword)
  } catch (error) {
    console.error("Get students error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
