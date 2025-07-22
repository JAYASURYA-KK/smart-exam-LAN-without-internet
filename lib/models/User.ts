import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  username: string
  password: string
  fullName: string
  studentId?: string
  role: "teacher" | "student"
  isOnline: boolean
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  _id?: ObjectId
  userId: ObjectId
  sessionToken: string
  ipAddress?: string
  userAgent?: string
  createdAt: Date
  expiresAt: Date
  isActive: boolean
}
