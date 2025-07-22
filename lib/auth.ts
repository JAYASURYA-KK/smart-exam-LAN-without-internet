import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { getDatabase } from "./mongodb"
import type { User, UserSession } from "./models/User"
import type { ObjectId } from "mongodb"

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key"

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(userId: string, role: string): string {
  return jwt.sign({ userId, role, timestamp: Date.now() }, JWT_SECRET, { expiresIn: "24h" })
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function createUser(userData: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
  const db = await getDatabase()
  const hashedPassword = await hashPassword(userData.password)

  const user: Omit<User, "_id"> = {
    ...userData,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const result = await db.collection("users").insertOne(user)
  return result.insertedId
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const db = await getDatabase()
  return db.collection<User>("users").findOne({ username })
}

export async function updateUserOnlineStatus(userId: ObjectId, isOnline: boolean): Promise<void> {
  const db = await getDatabase()
  await db.collection("users").updateOne(
    { _id: userId },
    {
      $set: {
        isOnline,
        updatedAt: new Date(),
      },
    },
  )
}

export async function createSession(userId: ObjectId, ipAddress?: string, userAgent?: string): Promise<string> {
  const db = await getDatabase()
  const sessionToken = generateToken(userId.toString(), "session")

  const session: Omit<UserSession, "_id"> = {
    userId,
    sessionToken,
    ipAddress,
    userAgent,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    isActive: true,
  }

  await db.collection("user_sessions").insertOne(session)
  return sessionToken
}
