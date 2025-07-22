import type { ObjectId } from "mongodb"

export interface Question {
  _id?: ObjectId
  type: "mcq" | "coding"
  question: string
  // MCQ fields
  options?: string[]
  correctAnswer?: number
  // Coding fields
  language?: "python" | "nodejs"
  starterCode?: string
  testCases?: TestCase[]
  expectedOutput?: string
  points: number
  questionOrder: number
}

export interface TestCase {
  input: string
  expectedOutput: string
  isHidden?: boolean
}

export interface Exam {
  _id?: ObjectId
  title: string
  description: string
  duration: number // in minutes
  status: "draft" | "active" | "completed"
  questions: Question[]
  createdBy: ObjectId
  createdAt: Date
  updatedAt: Date
}

export interface Submission {
  _id?: ObjectId
  studentId: ObjectId
  examId: ObjectId
  answers: Answer[]
  score: number
  totalPoints: number
  submittedAt: Date
  timeTaken: number // in seconds
}

export interface Answer {
  questionId: string
  type: "mcq" | "coding"
  // MCQ answer
  selectedOption?: number
  // Coding answer
  code?: string
  output?: string
  testResults?: TestResult[]
}

export interface TestResult {
  input: string
  expectedOutput: string
  actualOutput: string
  passed: boolean
}
