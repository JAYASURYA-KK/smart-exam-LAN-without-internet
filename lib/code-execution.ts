import { exec } from "child_process"
import { promises as fs } from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

export interface ExecutionResult {
  output: string
  error?: string
  executionTime: number
}

class CodeExecutionService {
  private tempDir: string

  constructor() {
    this.tempDir = path.join(process.cwd(), "temp")
    this.ensureTempDir()
  }

  private async ensureTempDir() {
    try {
      await fs.access(this.tempDir)
    } catch {
      await fs.mkdir(this.tempDir, { recursive: true })
    }
  }

  async executePython(code: string, input = ""): Promise<ExecutionResult> {
    const startTime = Date.now()
    const fileName = `${uuidv4()}.py`
    const filePath = path.join(this.tempDir, fileName)

    try {
      await fs.writeFile(filePath, code)

      return new Promise((resolve) => {
        const process = exec(
          `python3 "${filePath}"`,
          {
            timeout: 10000, // 10 second timeout
            maxBuffer: 1024 * 1024, // 1MB buffer
          },
          (error, stdout, stderr) => {
            const executionTime = Date.now() - startTime

            if (error) {
              resolve({
                output: "",
                error: stderr || error.message,
                executionTime,
              })
            } else {
              resolve({
                output: stdout.trim(),
                error: stderr ? stderr.trim() : undefined,
                executionTime,
              })
            }

            // Cleanup
            fs.unlink(filePath).catch(console.error)
          },
        )

        if (input) {
          process.stdin?.write(input)
          process.stdin?.end()
        }
      })
    } catch (error) {
      return {
        output: "",
        error: `File system error: ${error.message}`,
        executionTime: Date.now() - startTime,
      }
    }
  }

  async executeNodeJS(code: string, input = ""): Promise<ExecutionResult> {
    const startTime = Date.now()
    const fileName = `${uuidv4()}.js`
    const filePath = path.join(this.tempDir, fileName)

    try {
      await fs.writeFile(filePath, code)

      return new Promise((resolve) => {
        const process = exec(
          `node "${filePath}"`,
          {
            timeout: 10000, // 10 second timeout
            maxBuffer: 1024 * 1024, // 1MB buffer
          },
          (error, stdout, stderr) => {
            const executionTime = Date.now() - startTime

            if (error) {
              resolve({
                output: "",
                error: stderr || error.message,
                executionTime,
              })
            } else {
              resolve({
                output: stdout.trim(),
                error: stderr ? stderr.trim() : undefined,
                executionTime,
              })
            }

            // Cleanup
            fs.unlink(filePath).catch(console.error)
          },
        )

        if (input) {
          process.stdin?.write(input)
          process.stdin?.end()
        }
      })
    } catch (error) {
      return {
        output: "",
        error: `File system error: ${error.message}`,
        executionTime: Date.now() - startTime,
      }
    }
  }

  async executeCode(language: "python" | "nodejs", code: string, input = ""): Promise<ExecutionResult> {
    switch (language) {
      case "python":
        return this.executePython(code, input)
      case "nodejs":
        return this.executeNodeJS(code, input)
      default:
        return {
          output: "",
          error: "Unsupported language",
          executionTime: 0,
        }
    }
  }

  async runTestCases(
    language: "python" | "nodejs",
    code: string,
    testCases: Array<{ input: string; expectedOutput: string }>,
  ) {
    const results = []

    for (const testCase of testCases) {
      const result = await this.executeCode(language, code, testCase.input)
      results.push({
        input: testCase.input,
        expectedOutput: testCase.expectedOutput,
        actualOutput: result.output,
        passed: result.output.trim() === testCase.expectedOutput.trim(),
        error: result.error,
      })
    }

    return results
  }
}

export const codeExecutionService = new CodeExecutionService()
