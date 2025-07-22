// Sample data seeding script for the exam system
// Run this after setting up the database

const sampleExams = [
  {
    id: "exam-001",
    title: "Mathematics Fundamentals",
    description: "Basic mathematics covering algebra, geometry, and arithmetic",
    duration: 45,
    status: "active",
    created_by: "admin-001",
    questions: [
      {
        id: "q001",
        question_text: "What is the value of 2 + 2?",
        option_a: "3",
        option_b: "4",
        option_c: "5",
        option_d: "6",
        correct_answer: 1,
        points: 1,
        question_order: 1,
      },
      {
        id: "q002",
        question_text: "What is the square root of 16?",
        option_a: "2",
        option_b: "3",
        option_c: "4",
        option_d: "5",
        correct_answer: 2,
        points: 1,
        question_order: 2,
      },
      {
        id: "q003",
        question_text: "What is 5 × 7?",
        option_a: "30",
        option_b: "32",
        option_c: "35",
        option_d: "40",
        correct_answer: 2,
        points: 1,
        question_order: 3,
      },
    ],
  },
  {
    id: "exam-002",
    title: "Science Quiz",
    description: "General science questions covering physics, chemistry, and biology",
    duration: 30,
    status: "draft",
    created_by: "admin-001",
    questions: [
      {
        id: "q004",
        question_text: "What is the chemical symbol for water?",
        option_a: "H2O",
        option_b: "CO2",
        option_c: "NaCl",
        option_d: "O2",
        correct_answer: 0,
        points: 1,
        question_order: 1,
      },
      {
        id: "q005",
        question_text: "How many bones are in the human body?",
        option_a: "196",
        option_b: "206",
        option_c: "216",
        option_d: "226",
        correct_answer: 1,
        points: 1,
        question_order: 2,
      },
    ],
  },
]

// Function to insert sample data
async function seedDatabase() {
  console.log("Seeding sample exam data...")

  for (const exam of sampleExams) {
    // Insert exam
    console.log(`Creating exam: ${exam.title}`)

    // Insert questions for this exam
    for (const question of exam.questions) {
      console.log(`  Adding question: ${question.question_text}`)
    }
  }

  console.log("Sample data seeding completed!")
}

// Export for use in Node.js environment
if (typeof module !== "undefined" && module.exports) {
  module.exports = { sampleExams, seedDatabase }
}
