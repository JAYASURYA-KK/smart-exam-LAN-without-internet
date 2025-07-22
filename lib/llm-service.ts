// Local LLM Service using Ollama - MCQ Only
class LLMService {
  private baseUrl: string
  private model: string

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434"
    this.model = process.env.OLLAMA_MODEL || "llama3.2"
  }

  async generateResponse(prompt: string, systemPrompt?: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.model,
          prompt: prompt,
          system: systemPrompt,
          stream: false,
          options: {
            temperature: 0.7,
            top_p: 0.9,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`LLM API error: ${response.statusText}`)
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("LLM Service Error:", error)
      throw new Error("Failed to generate AI response")
    }
  }

  async generateExamQuestions(subject: string, difficulty: string, count: number) {
    const systemPrompt = `You are an expert exam question generator. Generate high-quality, educational multiple choice questions that test understanding and practical knowledge.`

    const prompt = `Generate ${count} multiple choice questions about ${subject} with ${difficulty} difficulty level.

Format each question as JSON:
{
  "question": "Question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Why this answer is correct",
  "points": 1
}

Return only a JSON array of questions, no additional text.`

    console.log(`Generating questions with prompt: ${prompt.substring(0, 200)}...`)

    let rawResponse = "" // Declare response variable

    try {
      const response = await this.generateResponse(prompt, systemPrompt)
      rawResponse = response // Assign response to rawResponse variable
      console.log(`LLM Raw response: ${response.substring(0, 500)}...`)

      // Clean the response to extract JSON
      const jsonMatch = response.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        const parsedQuestions = JSON.parse(jsonMatch[0])
        console.log(`Successfully parsed ${parsedQuestions.length} questions`)
        return parsedQuestions
      }

      // If no JSON array found, try to find individual JSON objects
      const jsonObjects = response.match(/\{[^}]*\}/g)
      if (jsonObjects && jsonObjects.length > 0) {
        const questions = jsonObjects
          .map((obj) => {
            try {
              return JSON.parse(obj)
            } catch (e) {
              console.warn("Failed to parse individual JSON object:", obj)
              return null
            }
          })
          .filter(Boolean)

        if (questions.length > 0) {
          console.log(`Extracted ${questions.length} questions from individual JSON objects`)
          return questions
        }
      }

      throw new Error("No valid JSON found in response")
    } catch (error) {
      console.error("Failed to parse LLM response:", error)
      console.error("Raw response was:", rawResponse) // Use declared response variable
      throw new Error(`Failed to generate questions: ${error.message}`)
    }
  }

  async chatResponse(message: string, context = "", role: "teacher" | "student" = "student") {
    const systemPrompt =
      role === "teacher"
        ? "You are an AI assistant helping teachers manage exams and students. Be professional, helpful, and provide educational insights."
        : "You are an AI assistant helping students with their studies. Be encouraging, educational, and supportive. Do not provide direct answers to exam questions."

    const prompt = `Context: ${context}\n\nUser message: ${message}\n\nPlease provide a helpful response.`

    return await this.generateResponse(prompt, systemPrompt)
  }
}

export const llmService = new LLMService()
