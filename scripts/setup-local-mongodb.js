const { MongoClient } = require("mongodb")

// Local MongoDB setup script
async function setupLocalMongoDB() {
  const uri = "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("secure_exam_system")

    // Create collections
    await db.createCollection("users")
    await db.createCollection("exams")
    await db.createCollection("submissions")
    await db.createCollection("user_sessions")

    // Create indexes
    await db.collection("users").createIndex({ username: 1 }, { unique: true })
    await db.collection("users").createIndex({ studentId: 1 }, { unique: true, sparse: true })
    await db.collection("exams").createIndex({ status: 1 })
    await db.collection("submissions").createIndex({ studentId: 1, examId: 1 }, { unique: true })
    await db.collection("user_sessions").createIndex({ sessionToken: 1 })
    await db.collection("user_sessions").createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })

    console.log("Database setup completed successfully!")
    console.log("Collections created: users, exams, submissions, user_sessions")
    console.log("Indexes created for optimal performance")
  } catch (error) {
    console.error("Setup failed:", error)
  } finally {
    await client.close()
  }
}

setupLocalMongoDB()
