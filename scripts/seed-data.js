const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function seedData() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("secure_exam_system")

    // Hash passwords
    const adminPassword = await bcrypt.hash("admin123", 12)
    const studentPassword = await bcrypt.hash("student123", 12)

    // Insert default users
    const users = [
      {
        username: "admin",
        password: adminPassword,
        fullName: "System Administrator",
        role: "teacher",
        isOnline: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "student1",
        password: studentPassword,
        fullName: "John Doe",
        studentId: "STU001",
        role: "student",
        isOnline: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "student2",
        password: studentPassword,
        fullName: "Jane Smith",
        studentId: "STU002",
        role: "student",
        isOnline: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "student3",
        password: studentPassword,
        fullName: "Bob Johnson",
        studentId: "STU003",
        role: "student",
        isOnline: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]

    // Check if users already exist
    const existingUsers = await db.collection("users").countDocuments()
    if (existingUsers === 0) {
      await db.collection("users").insertMany(users)
      console.log("Default users created successfully!")
    } else {
      console.log("Users already exist, skipping user creation")
    }

    console.log("Data seeding completed!")
  } catch (error) {
    console.error("Seeding failed:", error)
  } finally {
    await client.close()
  }
}

seedData()
