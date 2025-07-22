import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Exam } from "@/lib/models/Exam"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth"

// Mock database - In production, use MongoDB
// const exams = [
//   {
//     _id: "1",
//     title: "Mathematics Quiz",
//     description: "Basic algebra and geometry questions",
//     duration: 30,
//     status: "active",
//     questions: [
//       {
//         _id: "q1",
//         question: "What is 2 + 2?",
//         options: ["3", "4", "5", "6"],
//         correctAnswer: 1,
//         points: 1,
//       },
//       {
//         _id: "q2",
//         question: "What is the square root of 16?",
//         options: ["2", "3", "4", "5"],
//         correctAnswer: 2,
//         points: 1,
//       },
//     ],
//     createdAt: new Date().toISOString(),
//     createdBy: "1",
//   },
// ]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const db = await getDatabase()
    const exams = await db.collection<Exam>("exams").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(
      exams.map((exam) => ({
        ...exam,
        _id: exam._id!.toString(),
        createdBy: exam.createdBy.toString(),
      })),
    )
  } catch (error) {
    console.error("Get exams error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 })
    }

    const { title, description, duration, questions } = await request.json()

    if (!title || !description || !duration || !questions || questions.length === 0) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()

    // Add question IDs and order
    const questionsWithIds = questions.map((q: any, index: number) => ({
      ...q,
      _id: new ObjectId(),
      questionOrder: index + 1,
    }))

    const exam: Omit<Exam, "_id"> = {
      title,
      description,
      duration,
      status: "draft",
      questions: questionsWithIds,
      createdBy: new ObjectId(decoded.userId),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await db.collection("exams").insertOne(exam)

    return NextResponse.json(
      {
        _id: result.insertedId.toString(),
        ...exam,
        createdBy: exam.createdBy.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create exam error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
