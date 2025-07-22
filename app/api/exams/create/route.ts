import { type NextRequest, NextResponse } from "next/server"

// This is a placeholder for your MongoDB connection and schema.
// In a real application, you would import your database client and define your Exam and Question models.
// For example:
// import { connectToDatabase } from "@/lib/mongodb";
// import ExamModel from "@/models/Exam";

export async function POST(request: NextRequest) {
  try {
    const examData = await request.json()

    console.log("Received exam data for storage:", JSON.stringify(examData, null, 2))

    // Validate incoming data structure
    if (!examData || !examData.title || !examData.questions || !Array.isArray(examData.questions)) {
      console.error("Validation failed: Missing required exam data fields or questions is not an array.")
      return NextResponse.json(
        { message: "Missing required exam data fields or invalid questions format" },
        { status: 400 },
      )
    }

    // Further validation for questions array content
    for (const question of examData.questions) {
      if (!question._id || !question.question || !question.type || !question.points) {
        console.error("Validation failed: Malformed question found in array:", question)
        return NextResponse.json({ message: "Malformed question data found" }, { status: 400 })
      }
      if (question.type === "mcq" && (!question.options || !Array.isArray(question.options))) {
        console.error("Validation failed: MCQ question missing options or options is not an array:", question)
        return NextResponse.json({ message: "MCQ question missing options" }, { status: 400 })
      }
      if (
        question.type === "coding" &&
        (!question.starterCode || !question.testCases || !Array.isArray(question.testCases))
      ) {
        console.error("Validation failed: Coding question missing starterCode or testCases:", question)
        return NextResponse.json({ message: "Coding question missing starterCode or testCases" }, { status: 400 })
      }
    }

    // In a real application, you would save this examData to your MongoDB database.
    // MongoDB's flexible schema (NoSQL) is well-suited for storing such polymorphic data directly.
    // The `examData.questions` array already contains objects with `type: "mcq"` or `type: "coding"`,
    // along with their specific properties (options for MCQ, testCases/starterCode for coding).

    // Example of how you might save to MongoDB (uncomment and replace with your actual logic):
    // await connectToDatabase();
    // const newExam = new ExamModel(examData);
    // await newExam.save();

    console.log("Exam data successfully processed (simulated save).")
    return NextResponse.json({ message: "Exam created successfully!", exam: examData }, { status: 201 })
  } catch (error) {
    console.error("Error creating exam:", error)
    // If the error is a JSON parsing error, provide a more specific message
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Invalid JSON in request body. Please check the data format." },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { message: "Failed to create exam. Please check server logs for details." },
      { status: 500 },
    )
  }
}
