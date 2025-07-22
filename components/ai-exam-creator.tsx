"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Plus, Trash2, FileText } from "lucide-react"

interface AIExamCreatorProps {
  onExamGenerated: (examData: any) => void
}

export function AIExamCreator({ onExamGenerated }: AIExamCreatorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [examConfig, setExamConfig] = useState({
    title: "",
    description: "",
    duration: 60,
    subject: "",
    difficulty: "medium",
    questionCount: 10,
  })
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([])

  // Helper function to safely parse integers
  const safeParseInt = (value: string, fallback = 0): number => {
    const parsed = Number.parseInt(value, 10)
    return isNaN(parsed) || parsed < 0 ? fallback : parsed
  }

  const generateExam = async () => {
    if (!examConfig.subject || !examConfig.title) {
      alert("Please fill in the subject and title")
      return
    }

    if (examConfig.questionCount === 0) {
      alert("Please specify at least one question")
      return
    }

    setIsGenerating(true)
    try {
      console.log("Sending request to generate questions:", {
        subject: examConfig.subject,
        difficulty: examConfig.difficulty,
        count: examConfig.questionCount,
      })

      const response = await fetch("/api/ai/generate-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: examConfig.subject,
          difficulty: examConfig.difficulty,
          count: examConfig.questionCount,
        }),
      })

      const data = await response.json()
      console.log("Response from API:", data)

      if (response.ok && data.success) {
        const questions = data.questions.map((q: any) => ({ ...q, type: "mcq" }))
        setGeneratedQuestions(questions)

        if (questions.length === 0) {
          alert("No questions were generated. Please check your configuration and try again.")
        } else {
          console.log(`Successfully generated ${questions.length} questions`)
        }
      } else {
        console.error("API Error:", data)
        const errorMsg = data.details || data.error || "Unknown error occurred"
        alert(`Failed to generate questions: ${errorMsg}`)
      }
    } catch (error) {
      console.error("Network error:", error)
      alert("Network error: Please check your connection and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const removeQuestion = (index: number) => {
    setGeneratedQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const createExam = () => {
    if (generatedQuestions.length === 0) {
      alert("Please generate questions first")
      return
    }

    const examData = {
      title: examConfig.title,
      description: examConfig.description,
      duration: examConfig.duration,
      questions: generatedQuestions.map((q, index) => ({
        ...q,
        _id: Date.now().toString() + index,
        questionOrder: index + 1,
      })),
    }

    onExamGenerated(examData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          AI MCQ Exam Creator
        </CardTitle>
        <CardDescription>
          Use AI to automatically generate multiple choice questions based on your requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ai-title">Exam Title</Label>
            <Input
              id="ai-title"
              value={examConfig.title}
              onChange={(e) => setExamConfig({ ...examConfig, title: e.target.value })}
              placeholder="e.g., Python Programming Basics"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-duration">Duration (minutes)</Label>
            <Input
              id="ai-duration"
              type="number"
              min="1"
              value={examConfig.duration}
              onChange={(e) => setExamConfig({ ...examConfig, duration: safeParseInt(e.target.value, 60) })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="ai-description">Description</Label>
          <Textarea
            id="ai-description"
            value={examConfig.description}
            onChange={(e) => setExamConfig({ ...examConfig, description: e.target.value })}
            placeholder="Brief description of the exam"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ai-subject">Subject/Topic</Label>
            <Input
              id="ai-subject"
              value={examConfig.subject}
              onChange={(e) => setExamConfig({ ...examConfig, subject: e.target.value })}
              placeholder="e.g., Python, Data Structures, Web Development"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ai-difficulty">Difficulty Level</Label>
            <select
              id="ai-difficulty"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={examConfig.difficulty}
              onChange={(e) => setExamConfig({ ...examConfig, difficulty: e.target.value })}
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="question-count">Number of Questions</Label>
            <Input
              id="question-count"
              type="number"
              min="1"
              max="50"
              value={examConfig.questionCount}
              onChange={(e) => setExamConfig({ ...examConfig, questionCount: safeParseInt(e.target.value, 10) })}
              placeholder="e.g., 10"
            />
          </div>
        </div>

        {/* Question count summary */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Total Questions: <span className="font-semibold">{examConfig.questionCount}</span> Multiple Choice Questions
          </p>
        </div>

        <Button
          onClick={generateExam}
          disabled={isGenerating || !examConfig.subject || !examConfig.title || examConfig.questionCount === 0}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Generating Questions...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Generate MCQ Exam with AI
            </>
          )}
        </Button>

        {/* Generated Questions Preview */}
        {generatedQuestions.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generated Questions ({generatedQuestions.length})</h3>
              <Button onClick={createExam} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create Exam
              </Button>
            </div>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {generatedQuestions.map((question, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <Badge variant="default">MCQ</Badge>
                        <span className="text-sm text-gray-600">Points: {question.points}</span>
                      </div>
                      <p className="font-medium mb-2">{question.question}</p>
                      <div className="text-sm text-gray-600">
                        <p>Options: {question.options?.join(", ")}</p>
                        <p>Correct: {question.options?.[question.correctAnswer]}</p>
                        {question.explanation && (
                          <p className="mt-1 text-xs italic">Explanation: {question.explanation}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeQuestion(index)}>
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
