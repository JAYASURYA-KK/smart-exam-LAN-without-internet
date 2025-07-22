import { type NextRequest, NextResponse } from "next/server"
import { llmService } from "@/lib/llm-service"

export async function POST(request: NextRequest) {
  try {
    const { message, context, role } = await request.json()

    if (!message) {
      return NextResponse.json({ message: "Message is required" }, { status: 400 })
    }

    const response = await llmService.chatResponse(message, context, role)

    return NextResponse.json({ response })
  } catch (error) {
    console.error("AI Chat error:", error)
    return NextResponse.json(
      { message: "AI service is currently unavailable. Please ensure Ollama is running." },
      { status: 500 },
    )
  }
}
