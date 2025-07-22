import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const examId = params.id

    if (!ObjectId.isValid(examId)) {
      return NextResponse.json({ message: "Invalid exam ID" }, { status: 400 })
    }

    const db = await getDatabase()

    const result = await db.collection("exams").updateOne(
      { _id: new ObjectId(examId) },
      {
        $set: {
          status: "active",
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Exam activated successfully" })
  } catch (error) {
    console.error("Activate exam error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
