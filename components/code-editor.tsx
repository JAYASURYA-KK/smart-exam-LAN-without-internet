"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Play, CheckCircle, XCircle, Clock } from "lucide-react"

interface CodeEditorProps {
  question: any
  onCodeChange: (code: string) => void
  onSubmit: (code: string, results: any[]) => void
  initialCode?: string
}

export function CodeEditor({ question, onCodeChange, onSubmit, initialCode = "" }: CodeEditorProps) {
  const [code, setCode] = useState(initialCode || question.starterCode || "")
  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])

  useEffect(() => {
    onCodeChange(code)
  }, [code, onCodeChange])

  const runCode = async () => {
    setIsRunning(true)
    setOutput("")
    setTestResults([])

    try {
      const response = await fetch("/api/code/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: question.language,
          code: code,
          testCases: question.testCases || [],
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setOutput(data.output || "")
        setTestResults(data.testResults || [])
      } else {
        setOutput(`Error: ${data.message}`)
      }
    } catch (error) {
      setOutput(`Network error: ${error.message}`)
    } finally {
      setIsRunning(false)
    }
  }

  const submitCode = () => {
    onSubmit(code, testResults)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Badge variant="secondary">{question.language}</Badge>
            Code Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder={`Write your ${question.language} code here...`}
            className="font-mono text-sm min-h-[300px]"
          />
          <div className="flex gap-2 mt-4">
            <Button onClick={runCode} disabled={isRunning}>
              {isRunning ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Code
                </>
              )}
            </Button>
            <Button onClick={submitCode} variant="outline">
              Submit Answer
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output */}
      {output && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm font-mono whitespace-pre-wrap">{output}</pre>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded border ${
                    result.passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.passed ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span className="font-medium">Test Case {index + 1}</span>
                    <Badge variant={result.passed ? "default" : "destructive"}>
                      {result.passed ? "PASSED" : "FAILED"}
                    </Badge>
                  </div>
                  <div className="text-sm space-y-1">
                    <div>
                      <strong>Input:</strong> {result.input || "No input"}
                    </div>
                    <div>
                      <strong>Expected:</strong> {result.expectedOutput}
                    </div>
                    <div>
                      <strong>Actual:</strong> {result.actualOutput}
                    </div>
                    {result.error && (
                      <div className="text-red-600">
                        <strong>Error:</strong> {result.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
