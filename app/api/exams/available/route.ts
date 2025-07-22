import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Exam } from "@/lib/models/Exam"

export async function GET() {
  try {
    const db = await getDatabase()
    const activeExams = await db.collection<Exam>("exams").find({ status: "active" }).sort({ createdAt: -1 }).toArray()

    // Remove correct answers from questions for students
    const examsForStudents = activeExams.map((exam) => ({
      ...exam,
      _id: exam._id!.toString(),
      createdBy: exam.createdBy.toString(),
      questions: exam.questions.map((q) => ({
        _id: q._id!.toString(),
        question: q.question,
        options: q.options,
        points: q.points,
        questionOrder: q.questionOrder,
      })),
    }))

    return NextResponse.json(examsForStudents)
  } catch (error) {
    console.error("Get available exams error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
