import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import type { Submission } from "@/lib/models/Exam"
import { ObjectId } from "mongodb"
import { verifyToken } from "@/lib/auth"

export async function GET() {
  try {
    const db = await getDatabase()

    // Get submissions with student details
    const submissions = await db
      .collection("submissions")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "studentId",
            foreignField: "_id",
            as: "student",
          },
        },
        {
          $lookup: {
            from: "exams",
            localField: "examId",
            foreignField: "_id",
            as: "exam",
          },
        },
        {
          $unwind: "$student",
        },
        {
          $unwind: "$exam",
        },
        {
          $project: {
            _id: 1,
            score: 1,
            totalPoints: 1,
            submittedAt: 1,
            timeTaken: 1,
            "student._id": 1,
            "student.fullName": 1,
            "student.studentId": 1,
            "exam.title": 1,
          },
        },
        {
          $sort: { submittedAt: -1 },
        },
      ])
      .toArray()

    const formattedSubmissions = submissions.map((sub) => ({
      ...sub,
      _id: sub._id.toString(),
      student: {
        ...sub.student,
        _id: sub.student._id.toString(),
      },
    }))

    return NextResponse.json(formattedSubmissions)
  } catch (error) {
    console.error("Get submissions error:", error)
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

    const { examId, answers, timeTaken } = await request.json()

    if (!examId || !answers) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    const db = await getDatabase()

    // Get exam details
    const exam = await db.collection("exams").findOne({ _id: new ObjectId(examId) })
    if (!exam) {
      return NextResponse.json({ message: "Exam not found" }, { status: 404 })
    }

    // Calculate score
    let totalPoints = 0
    let earnedPoints = 0

    exam.questions.forEach((question: any) => {
      totalPoints += question.points
      const userAnswer = answers.find((a: any) => a.questionId === question._id.toString())
      if (userAnswer && userAnswer.answer === question.correctAnswer) {
        earnedPoints += question.points
      }
    })

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0

    // Check if submission already exists
    const existingSubmission = await db.collection("submissions").findOne({
      studentId: new ObjectId(decoded.userId),
      examId: new ObjectId(examId),
    })

    if (existingSubmission) {
      return NextResponse.json({ message: "Exam already submitted" }, { status: 400 })
    }

    const submission: Omit<Submission, "_id"> = {
      studentId: new ObjectId(decoded.userId),
      examId: new ObjectId(examId),
      answers,
      score,
      totalPoints,
      submittedAt: new Date(),
      timeTaken: timeTaken || 0,
    }

    const result = await db.collection("submissions").insertOne(submission)

    return NextResponse.json(
      {
        _id: result.insertedId.toString(),
        ...submission,
        studentId: submission.studentId.toString(),
        examId: submission.examId.toString(),
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Submit exam error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
