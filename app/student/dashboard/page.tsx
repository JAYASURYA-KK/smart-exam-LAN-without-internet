"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Clock, CheckCircle, AlertCircle, LogOut, Play, Send } from "lucide-react"
import { AIChatbot } from "@/components/ai-chatbot"

interface Exam {
  _id: string
  title: string
  description: string
  duration: number
  questions: Question[]
  status: "draft" | "active" | "completed"
}

interface Question {
  _id: string
  question: string
  options: string[]
  points: number
  type: "mcq"
  correctAnswer: number
  explanation?: string
}

interface UserAnswer {
  questionId: string
  answer: number
  type: "mcq"
}

export default function StudentDashboard() {
  const [user, setUser] = useState<any>(null)
  const [availableExams, setAvailableExams] = useState<Exam[]>([])
  const [currentExam, setCurrentExam] = useState<Exam | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<UserAnswer[]>([])
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [examStarted, setExamStarted] = useState(false)
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      window.location.href = "/"
      return
    }

    const user = JSON.parse(userData)
    if (user.role !== "student") {
      window.location.href = "/"
      return
    }

    setUser(user)
    fetchAvailableExams()
    fetchSubmissions()
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (examStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            submitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [examStarted, timeRemaining])

  const fetchAvailableExams = async () => {
    try {
      const response = await fetch("/api/exams/available")
      if (response.ok) {
        const data = await response.json()
        setAvailableExams(data)
      }
    } catch (error) {
      console.error("Error fetching exams:", error)
    }
  }

  const fetchSubmissions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/submissions/student", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error("Error fetching submissions:", error)
    }
  }

  const startExam = (exam: Exam) => {
    setCurrentExam(exam)
    setTimeRemaining(exam.duration * 60) // Convert minutes to seconds
    setExamStarted(true)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setExamSubmitted(false)
  }

  const selectAnswer = (questionId: string, answerIndex: number) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.questionId === questionId)
      const answerData = { questionId, answer: answerIndex, type: "mcq" as const }

      if (existing) {
        return prev.map((a) => (a.questionId === questionId ? answerData : a))
      } else {
        return [...prev, answerData]
      }
    })
  }

  const nextQuestion = () => {
    if (currentExam && currentQuestionIndex < currentExam.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const submitExam = async () => {
    if (!currentExam) return

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          examId: currentExam._id,
          answers: answers,
          timeTaken: currentExam.duration * 60 - timeRemaining,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setExamSubmitted(true)
        setExamStarted(false)
        alert("Exam submitted successfully!")
      } else {
        alert(data.message || "Error submitting exam. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting exam:", error)
      alert("Error submitting exam. Please try again.")
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const getCurrentAnswer = () => {
    if (!currentExam) return -1
    const currentQuestion = currentExam.questions[currentQuestionIndex]
    const answer = answers.find((a) => a.questionId === currentQuestion._id)
    return answer ? answer.answer : -1
  }

  if (examStarted && currentExam && !examSubmitted) {
    const currentQuestion = currentExam.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentExam.questions.length) * 100
    const currentAnswer = getCurrentAnswer()

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Exam Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{currentExam.title}</h1>
                <p className="text-sm text-gray-600">
                  Question {currentQuestionIndex + 1} of {currentExam.questions.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">
                    <Clock className="h-4 w-4 inline mr-1" />
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-xs text-gray-600">Time Remaining</p>
                </div>
                <Button onClick={submitExam} variant="destructive" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Submit
                </Button>
              </div>
            </div>
            <Progress value={progress} className="mb-4" />
          </div>
        </div>

        {/* Question Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Question {currentQuestionIndex + 1}</CardTitle>
              <CardDescription>Points: {currentQuestion.points}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg">{currentQuestion.question}</div>

              {/* MCQ Options */}
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => selectAnswer(currentQuestion._id, index)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      currentAnswer === index
                        ? "bg-blue-50 border-blue-500 text-blue-900"
                        : "bg-white border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 rounded-full border-2 mr-3 ${
                          currentAnswer === index ? "bg-blue-500 border-blue-500" : "border-gray-300"
                        }`}
                      >
                        {currentAnswer === index && <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>}
                      </div>
                      <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                      <span>{option}</span>
                    </div>
                  </div>
                )) || <div className="text-gray-500">No options available</div>}
              </div>

              <div className="flex justify-between pt-6">
                <Button onClick={previousQuestion} disabled={currentQuestionIndex === 0} variant="outline">
                  Previous
                </Button>

                {currentQuestionIndex === currentExam.questions.length - 1 ? (
                  <Button onClick={submitExam} className="bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Exam
                  </Button>
                ) : (
                  <Button onClick={nextQuestion}>Next</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Question Navigation */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Question Navigation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-10 gap-2">
                {currentExam.questions.map((_, index) => {
                  const isAnswered = answers.some((a) => a.questionId === currentExam.questions[index]._id)
                  const isCurrent = index === currentQuestionIndex

                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`w-8 h-8 rounded text-sm font-medium ${
                        isCurrent
                          ? "bg-blue-600 text-white"
                          : isAnswered
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-gray-100 text-gray-600 border border-gray-300"
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>
              <div className="flex items-center gap-4 mt-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-600 rounded"></div>
                  <span>Current</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-gray-100 border border-gray-300 rounded"></div>
                  <span>Not Answered</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
              <p className="text-sm text-gray-600">
                Welcome, {user?.fullName} ({user?.studentId})
              </p>
            </div>
            <Button onClick={logout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {examSubmitted ? (
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <CardTitle>Exam Submitted Successfully!</CardTitle>
              <CardDescription>Your answers have been recorded. Results will be available soon.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  setExamSubmitted(false)
                  setCurrentExam(null)
                  fetchAvailableExams()
                }}
              >
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available Exams</CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{availableExams.length}</div>
                  <p className="text-xs text-muted-foreground">Ready to take</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">Online</div>
                  <p className="text-xs text-muted-foreground">Connected to exam server</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Student ID</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user?.studentId}</div>
                  <p className="text-xs text-muted-foreground">Your identification</p>
                </CardContent>
              </Card>
            </div>

            {/* Previous Submissions */}
            {submissions.length > 0 && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Your Results</CardTitle>
                  <CardDescription>Previous exam submissions and scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {submissions.map((submission) => (
                      <div key={submission._id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{submission.exam?.title}</h3>
                          <p className="text-sm text-gray-600">
                            Submitted: {new Date(submission.submittedAt).toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            Time taken: {Math.floor(submission.timeTaken / 60)}m {submission.timeTaken % 60}s
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{submission.score}%</div>
                          <p className="text-sm text-gray-600">{submission.score >= 60 ? "Passed" : "Failed"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Exams */}
            <Card>
              <CardHeader>
                <CardTitle>Available Examinations</CardTitle>
                <CardDescription>Click on an exam to start taking it</CardDescription>
              </CardHeader>
              <CardContent>
                {availableExams.length === 0 ? (
                  <div className="text-center py-8">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Exams Available</h3>
                    <p className="text-gray-600">
                      There are currently no active examinations. Please wait for your teacher to activate an exam.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {availableExams.map((exam) => (
                      <div
                        key={exam._id}
                        className="flex items-center justify-between p-6 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div>
                          <h3 className="text-lg font-semibold">{exam.title}</h3>
                          <p className="text-gray-600 mb-2">{exam.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>
                              <Clock className="h-4 w-4 inline mr-1" />
                              {exam.duration} minutes
                            </span>
                            <span>
                              <BookOpen className="h-4 w-4 inline mr-1" />
                              {exam.questions.length} questions
                            </span>
                            <Badge variant="default">{exam.status}</Badge>
                          </div>
                        </div>
                        <Button onClick={() => startExam(exam)} size="lg">
                          <Play className="h-4 w-4 mr-2" />
                          Start Exam
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
      <AIChatbot role="student" context="Student dashboard - taking MCQ exams and viewing results" />
    </div>
  )
}
