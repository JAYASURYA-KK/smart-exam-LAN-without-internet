"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, BarChart3, Plus, Eye, Send, Clock, CheckCircle, LogOut, Sparkles } from "lucide-react"
import { AIChatbot } from "@/components/ai-chatbot"
import { AIExamCreator } from "@/components/ai-exam-creator"

interface Exam {
  _id: string
  title: string
  description: string
  duration: number
  questions: Question[]
  status: "draft" | "active" | "completed"
  createdAt: string
}

interface Question {
  _id: string
  question: string
  options: string[]
  correctAnswer: number
  points: number
}

interface Student {
  _id: string
  username: string
  fullName: string
  studentId: string
  isOnline: boolean
}

interface Submission {
  _id: string
  studentId: string
  examId: string
  answers: { questionId: string; answer: number }[]
  score: number
  submittedAt: string
  student: Student
}

export default function TeacherDashboard() {
  const [exams, setExams] = useState<Exam[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [newExam, setNewExam] = useState({
    title: "",
    description: "",
    duration: 60,
    questions: [],
  })
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: ["", "", "", ""],
    correctAnswer: 0,
    points: 1,
  })
  const [showAICreator, setShowAICreator] = useState(false)

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token || !user) {
      window.location.href = "/"
      return
    }

    const userData = JSON.parse(user)
    if (userData.role !== "teacher") {
      window.location.href = "/"
      return
    }

    fetchExams()
    fetchStudents()
    fetchSubmissions()
  }, [])

  const fetchExams = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/exams", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (response.ok) {
        const data = await response.json()
        setExams(data)
      }
    } catch (error) {
      console.error("Error fetching exams:", error)
    }
  }

  const fetchStudents = async () => {
    try {
      const response = await fetch("/api/students")
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/submissions")
      if (response.ok) {
        const data = await response.json()
        setSubmissions(data)
      }
    } catch (error) {
      console.error("Error fetching submissions:", error)
    }
  }

  const createExam = async () => {
    if (!newExam.title || !newExam.description || newExam.questions.length === 0) {
      alert("Please fill in all required fields and add at least one question")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/exams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newExam),
      })

      const data = await response.json()

      if (response.ok) {
        fetchExams()
        setNewExam({ title: "", description: "", duration: 60, questions: [] })
        alert("Exam created successfully!")
      } else {
        alert(data.message || "Failed to create exam")
      }
    } catch (error) {
      console.error("Error creating exam:", error)
      alert("Error creating exam. Please try again.")
    }
  }

  const addQuestion = () => {
    if (newQuestion.question && newQuestion.options.every((opt) => opt.trim())) {
      setNewExam({
        ...newExam,
        questions: [...newExam.questions, { ...newQuestion, _id: Date.now().toString() }],
      })
      setNewQuestion({
        question: "",
        options: ["", "", "", ""],
        correctAnswer: 0,
        points: 1,
      })
    }
  }

  const activateExam = async (examId: string) => {
    try {
      const response = await fetch(`/api/exams/${examId}/activate`, {
        method: "POST",
      })

      if (response.ok) {
        fetchExams()
        alert("Exam activated and sent to all students!")
      }
    } catch (error) {
      console.error("Error activating exam:", error)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const handleAIExamGenerated = (examData: any) => {
    setNewExam(examData)
    setShowAICreator(false)
    alert("AI-generated exam loaded! You can review and modify before creating.")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
              <p className="text-sm text-gray-600">Manage exams and monitor student progress</p>
            </div>
            <Button onClick={logout} variant="outline">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">{students.filter((s) => s.isOnline).length} online</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{exams.filter((e) => e.status === "active").length}</div>
              <p className="text-xs text-muted-foreground">{exams.filter((e) => e.status === "draft").length} drafts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Submissions</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
              <p className="text-xs text-muted-foreground">Total submissions received</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.length > 0
                  ? Math.round(submissions.reduce((acc, sub) => acc + sub.score, 0) / submissions.length)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">Across all exams</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="exams" className="space-y-6">
          <TabsList>
            <TabsTrigger value="exams">Exam Management</TabsTrigger>
            <TabsTrigger value="students">Students</TabsTrigger>
            <TabsTrigger value="results">Results</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="space-y-6">
            {/* Create New Exam */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Create New Exam</CardTitle>
                    <CardDescription>Design and configure a new examination</CardDescription>
                  </div>
                  <Button onClick={() => setShowAICreator(!showAICreator)} variant="outline">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Create
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {showAICreator && <AIExamCreator onExamGenerated={handleAIExamGenerated} />}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exam-title">Exam Title</Label>
                    <Input
                      id="exam-title"
                      value={newExam.title}
                      onChange={(e) => setNewExam({ ...newExam, title: e.target.value })}
                      placeholder="Enter exam title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="exam-duration">Duration (minutes)</Label>
                    <Input
                      id="exam-duration"
                      type="number"
                      value={newExam.duration}
                      onChange={(e) => setNewExam({ ...newExam, duration: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exam-description">Description</Label>
                  <Textarea
                    id="exam-description"
                    value={newExam.description}
                    onChange={(e) => setNewExam({ ...newExam, description: e.target.value })}
                    placeholder="Enter exam description"
                  />
                </div>

                {/* Add Questions */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-4">Add Questions</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question</Label>
                      <Textarea
                        value={newQuestion.question}
                        onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                        placeholder="Enter your question"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="space-y-2">
                          <Label>Option {index + 1}</Label>
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options]
                              newOptions[index] = e.target.value
                              setNewQuestion({ ...newQuestion, options: newOptions })
                            }}
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Correct Answer</Label>
                        <select
                          className="w-full p-2 border border-gray-300 rounded-md"
                          value={newQuestion.correctAnswer}
                          onChange={(e) =>
                            setNewQuestion({ ...newQuestion, correctAnswer: Number.parseInt(e.target.value) })
                          }
                        >
                          {newQuestion.options.map((_, index) => (
                            <option key={index} value={index}>
                              Option {index + 1}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Points</Label>
                        <Input
                          type="number"
                          value={newQuestion.points}
                          onChange={(e) => setNewQuestion({ ...newQuestion, points: Number.parseInt(e.target.value) })}
                        />
                      </div>
                    </div>

                    <Button onClick={addQuestion}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Question
                    </Button>
                  </div>
                </div>

                {/* Questions List */}
                {newExam.questions.length > 0 && (
                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-4">Questions ({newExam.questions.length})</h3>
                    <div className="space-y-2">
                      {newExam.questions.map((q, index) => (
                        <div key={q._id} className="p-3 border rounded-lg">
                          <p className="font-medium">
                            {index + 1}. {q.question}
                          </p>
                          <p className="text-sm text-gray-600">Points: {q.points}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={createExam}
                  className="w-full"
                  disabled={!newExam.title || newExam.questions.length === 0}
                >
                  Create Exam
                </Button>
              </CardContent>
            </Card>

            {/* Existing Exams */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Exams</CardTitle>
                <CardDescription>Manage and monitor your examinations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <div key={exam._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{exam.title}</h3>
                        <p className="text-sm text-gray-600">{exam.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant={
                              exam.status === "active"
                                ? "default"
                                : exam.status === "completed"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {exam.status}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {exam.duration} min
                          </span>
                          <span className="text-xs text-gray-500">{exam.questions.length} questions</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {exam.status === "draft" && (
                          <Button onClick={() => activateExam(exam._id)} size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Activate
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Student Management</CardTitle>
                <CardDescription>Monitor student activity and status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{student.fullName}</h3>
                        <p className="text-sm text-gray-600">ID: {student.studentId}</p>
                        <p className="text-sm text-gray-600">Username: {student.username}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={student.isOnline ? "default" : "secondary"}>
                          {student.isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results">
            <Card>
              <CardHeader>
                <CardTitle>Exam Results</CardTitle>
                <CardDescription>View and analyze student submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <div key={submission._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{submission.student?.fullName}</h3>
                        <p className="text-sm text-gray-600">Student ID: {submission.student?.studentId}</p>
                        <p className="text-sm text-gray-600">
                          Submitted: {new Date(submission.submittedAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600">{submission.score}%</div>
                        <p className="text-sm text-gray-600">Score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <AIChatbot role="teacher" context="Teacher dashboard - managing exams and students" />
    </div>
  )
}
