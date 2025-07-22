# AI-Powered MCQ Exam System

A modern, AI-powered Multiple Choice Question (MCQ) exam system built with Next.js, React, and local LLM integration using Ollama. This system allows teachers to create AI-generated exams and students to take them in a secure, timed environment.

![Home Page](screenshots/home.png)

## Features

### 🎓 For Teachers
- **AI-Powered Question Generation**: Automatically generate MCQ questions using local LLM
- **Exam Management**: Create, edit, and manage exams with ease
- **Real-time Monitoring**: Monitor student progress during exams
- **Detailed Analytics**: View comprehensive exam results and statistics
- **Flexible Configuration**: Set exam duration, difficulty levels, and question counts

![Teacher Dashboard](screenshots/teacherdashboard.png)

### 📚 For Students
- **Intuitive Exam Interface**: Clean, distraction-free exam taking experience
- **Real-time Timer**: Visual countdown timer with automatic submission
- **Question Navigation**: Easy navigation between questions with progress tracking
- **Instant Results**: View scores and performance immediately after submission
- **AI Chat Support**: Get help from AI assistant during studies

![Student Dashboard](screenshots/studentdashboard.png)

### 🤖 AI Integration
- **Local LLM Support**: Uses Ollama for privacy-focused AI question generation
- **Multiple Difficulty Levels**: Easy, Medium, and Hard question generation
- **Subject Flexibility**: Generate questions for any subject or topic
- **Quality Assurance**: AI-generated questions include explanations and validation

## Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **AI Integration**: Ollama (Local LLM)
- **Authentication**: JWT-based authentication
- **Database**: MongoDB (configurable)


## Prerequisites

Before running this application, make sure you have:

- Node.js 18+ installed
- Ollama installed and running locally
- A compatible LLM model (e.g., llama3.2, mistral, etc.)

### Installing Ollama

1. Visit [Ollama's official website](https://ollama.ai) and download the installer
2. Install Ollama on your system
3. Pull a compatible model:
   \`\`\`bash
   ollama pull llama3.2
   \`\`\`
4. Start the Ollama service:
   \`\`\`bash
   ollama serve
   \`\`\`

## Installation

1. **Clone the repository**
   \`\`\`bash
   git clone 
   cd ai-mcq-exam-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   
   Create a \`.env.local\` file in the root directory and add the following variables:

   \`\`\`env
   # Ollama Configuration
   OLLAMA_BASE_URL=http://localhost:11434
   OLLAMA_MODEL=llama3.2
   
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/exam-system
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here
   NEXTAUTH_SECRET=your-nextauth-secret-here
   NEXTAUTH_URL=http://localhost:3000
   
   # Application Configuration
   NODE_ENV=development
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| \`OLLAMA_BASE_URL\` | URL where Ollama service is running | \`http://localhost:11434\` |
| \`OLLAMA_MODEL\` | LLM model to use for question generation | \`llama3.2\` |
| \`MONGODB_URI\` | MongoDB connection string | \`mongodb://localhost:27017/exam-system\` |
| \`JWT_SECRET\` | Secret key for JWT token signing | \`your-super-secret-jwt-key\` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| \`NEXTAUTH_SECRET\` | NextAuth.js secret for session encryption | Auto-generated |
| \`NEXTAUTH_URL\` | Base URL for authentication callbacks | \`http://localhost:3000\` |
| \`NODE_ENV\` | Environment mode | \`development\` |

## Usage

### For Teachers

1. **Register/Login** as a teacher
2. **Create New Exam**:
   - Fill in exam details (title, description, duration)
   - Specify subject and difficulty level
   - Set number of questions
   - Click "Generate MCQ Exam with AI"
3. **Review Generated Questions**:
   - Preview all generated questions
   - Remove unwanted questions if needed
   - Click "Create Exam" to finalize
4. **Manage Exams**:
   - Activate/deactivate exams
   - Monitor student progress
   - View detailed results and analytics

### For Students

1. **Register/Login** as a student
2. **View Available Exams** on the dashboard
3. **Start Exam**:
   - Click "Start Exam" on any available exam
   - Read instructions carefully
   - Answer questions within the time limit
4. **Submit Exam**:
   - Review answers using question navigation
   - Submit before time runs out
   - View results immediately

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - User registration
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/logout\` - User logout

### AI Integration
- \`POST /api/ai/generate-questions\` - Generate MCQ questions
- \`POST /api/ai/chat\` - AI chat assistance

### Exam Management
- \`GET /api/exams\` - Get all exams (teacher)
- \`POST /api/exams\` - Create new exam
- \`GET /api/exams/available\` - Get available exams (student)
- \`PUT /api/exams/:id\` - Update exam
- \`DELETE /api/exams/:id\` - Delete exam

### Submissions
- \`POST /api/submissions\` - Submit exam answers
- \`GET /api/submissions/student\` - Get student submissions
- \`GET /api/submissions/exam/:id\` - Get exam submissions (teacher)

## Deployment

### Vercel Deployment

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically

3. **Configure Ollama for Production**
   - Set up Ollama on a server or cloud instance
   - Update \`OLLAMA_BASE_URL\` to point to your production Ollama instance

### Docker Deployment

\`\`\`dockerfile
# Dockerfile example
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Troubleshooting

### Common Issues

1. **"Failed to generate questions"**
   - Ensure Ollama is running: \`ollama serve\`
   - Check if the model is available: \`ollama list\`
   - Verify \`OLLAMA_BASE_URL\` in \`.env.local\`

2. **Connection refused errors**
   - Check if Ollama is accessible at the configured URL
   - Try: \`curl http://localhost:11434/api/version\`

3. **Model not found**
   - Pull the required model: \`ollama pull llama3.2\`
   - Update \`OLLAMA_MODEL\` in \`.env.local\`

4. **Authentication issues**
   - Verify \`JWT_SECRET\` is set
   - Clear browser cookies and try again

### Performance Tips

- Use faster models like \`llama3.2:8b\` for better response times
- Adjust Ollama's \`num_ctx\` parameter for longer contexts
- Consider using GPU acceleration for Ollama

## Contributing

1. Fork the repository
2. Create a feature branch: \`git checkout -b feature/new-feature\`
3. Commit changes: \`git commit -am 'Add new feature'\`
4. Push to branch: \`git push origin feature/new-feature\`
5. Submit a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the troubleshooting section above
- Review Ollama documentation for LLM-related issues

## Acknowledgments

- [Ollama](https://ollama.ai) for local LLM integration
- [shadcn/ui](https://ui.shadcn.com) for beautiful UI components
- [Next.js](https://nextjs.org) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com) for utility-first styling
\`\`\`

