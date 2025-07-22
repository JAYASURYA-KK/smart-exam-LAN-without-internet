import { NextRequest, NextResponse } from "next/server"
import { llmService } from "@/lib/llm-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, difficulty, count } = body

    // Validate required fields
    if (!subject || !difficulty || !count) {
      return NextResponse.json(
        { error: "Missing required fields: subject, difficulty, count" },
        { status: 400 }
      )
    }

    // Validate count is a positive number
    if (typeof count !== "number" || count <= 0 || count > 50) {
      return NextResponse.json(
        { error: "Count must be a positive number between 1 and 50" },
        { status: 400 }
      )
    }

    // Validate difficulty level
    const validDifficulties = ["easy", "medium", "hard"]
    if (!validDifficulties.includes(difficulty.toLowerCase())) {
      return NextResponse.json(
        { error: "Difficulty must be one of: easy, medium, hard" },
        { status: 400 }
      )
    }

    console.log(`Generating ${count} MCQ questions for ${subject} (${difficulty} difficulty)`)

    // Generate MCQ questions using the LLM service
    const questions = await llmService.generateExamQuestions(
      subject,
      difficulty.toLowerCase(),
      count
    )

    // Validate the generated questions
    if (!Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json(
        { error: "No questions were generated. Please try again." },
        { status: 500 }
      )
    }

    // Ensure each question has the required fields
    const validatedQuestions = questions.map((q, index) => ({
      question: q.question || `Question ${index + 1}`,
      options: Array.isArray(q.options) && q.options.length >= 2 
        ? q.options 
        : ["Option A", "Option B", "Option C", "Option D"],
      correctAnswer: typeof q.correctAnswer === "number" && q.correctAnswer >= 0 
        ? q.correctAnswer 
        : 0,
      explanation: q.explanation || "No explanation provided",
      points: typeof q.points === "number" && q.points > 0 ? q.points : 1,
      type: "mcq"
    }))

    console.log(`Successfully generated ${validatedQuestions.length} questions`)

    return NextResponse.json({
      success: true,
      questions: validatedQuestions,
      count: validatedQuestions.length
    })

  } catch (error) {
    console.error("Error generating questions:", error)
    
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"
    
    return NextResponse.json(
      { 
        error: "Failed to generate questions", 
        details: errorMessage,
        suggestion: "Please check your LLM service configuration and try again"
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { error: "Method not allowed. Use POST to generate questions." },
    { status: 405 }
  )
}
