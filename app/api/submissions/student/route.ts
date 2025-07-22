import { type NextRequest, NextResponse } from "next/server"
import { getDatabase } from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"
import { ObjectId } from "mongodb"

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

    const submissions = await db
      .collection("submissions")
      .aggregate([
        {
          $match: { studentId: new ObjectId(decoded.userId) },
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
          $unwind: "$exam",
        },
        {
          $project: {
            _id: 1,
            score: 1,
            totalPoints: 1,
            submittedAt: 1,
            timeTaken: 1,
            "exam.title": 1,
            "exam.description": 1,
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
    }))

    return NextResponse.json(formattedSubmissions)
  } catch (error) {
    console.error("Get student submissions error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
