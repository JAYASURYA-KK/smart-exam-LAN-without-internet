import { type NextRequest, NextResponse } from "next/server"
import { codeExecutionService } from "@/lib/code-execution"

export async function POST(request: NextRequest) {
  try {
    const { language, code, testCases, input } = await request.json()

    if (!language || !code) {
      return NextResponse.json({ message: "Language and code are required" }, { status: 400 })
    }

    if (testCases && testCases.length > 0) {
      // Run test cases
      const testResults = await codeExecutionService.runTestCases(language, code, testCases)
      return NextResponse.json({ testResults })
    } else {
      // Simple execution
      const result = await codeExecutionService.executeCode(language, code, input)
      return NextResponse.json({
        output: result.output,
        error: result.error,
        executionTime: result.executionTime,
      })
    }
  } catch (error) {
    console.error("Code execution error:", error)
    return NextResponse.json({ message: "Code execution failed" }, { status: 500 })
  }
}
