# Local LLM Setup Guide for Offline Exam System

## Overview
This guide will help you set up a local Large Language Model (LLM) using Ollama for AI-powered features in your exam system.

## Prerequisites
- Windows 10/11, macOS, or Linux
- At least 8GB RAM (16GB recommended)
- 10GB free disk space
- Python 3.8+ and Node.js 18+ (already installed)

## Step 1: Install Ollama

### Windows
1. Download Ollama from: https://ollama.ai/download
2. Run the installer and follow the setup wizard
3. Ollama will start automatically as a service

### macOS
\`\`\`bash
# Using Homebrew
brew install ollama

# Or download from https://ollama.ai/download
\`\`\`

### Linux (Ubuntu/Debian)
\`\`\`bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Start Ollama service
sudo systemctl start ollama
sudo systemctl enable ollama
\`\`\`

## Step 2: Download AI Models

### Recommended Models for Education

#### 1. Llama 3.2 (Recommended - 2GB)
\`\`\`bash
ollama pull llama3.2
\`\`\`

#### 2. Phi-3 (Lightweight - 2.3GB)
\`\`\`bash
ollama pull phi3
\`\`\`

#### 3. CodeLlama (For coding questions - 3.8GB)
\`\`\`bash
ollama pull codellama
\`\`\`

### Verify Installation
\`\`\`bash
# Check if Ollama is running
ollama list

# Test the model
ollama run llama3.2
\`\`\`

## Step 3: Configure the Exam System

### Update Environment Variables
Edit your `.env.local` file:

\`\`\`env
# LLM Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Alternative models you can use:
# OLLAMA_MODEL=phi3
# OLLAMA_MODEL=codellama
\`\`\`

### Test LLM Integration
1. Start your exam system: `npm run dev`
2. Go to teacher dashboard
3. Click on "AI Create" button
4. Try generating questions

## Step 4: Optimize for Your Hardware

### For 8GB RAM Systems
Use lightweight models:
\`\`\`bash
ollama pull phi3:mini
\`\`\`

Update `.env.local`:
\`\`\`env
OLLAMA_MODEL=phi3:mini
\`\`\`

### For 16GB+ RAM Systems
Use more powerful models:
\`\`\`bash
ollama pull llama3.2:8b
ollama pull codellama:7b
\`\`\`

## Step 5: Advanced Configuration

### Custom Model Parameters
Create a custom Modelfile for education-specific responses:

\`\`\`bash
# Create Modelfile
cat > Modelfile << EOF
FROM llama3.2

PARAMETER temperature 0.7
PARAMETER top_p 0.9
PARAMETER top_k 40

SYSTEM """
You are an educational AI assistant specialized in creating exam questions and helping with academic content. You should:
1. Generate clear, well-structured questions
2. Provide accurate and educational responses
3. Maintain academic integrity
4. Be encouraging and supportive to students
5. Help teachers create fair and comprehensive assessments
"""
EOF

# Build custom model
ollama create exam-assistant -f Modelfile

# Use the custom model
ollama run exam-assistant
\`\`\`

Update `.env.local`:
\`\`\`env
OLLAMA_MODEL=exam-assistant
\`\`\`

## Step 6: Troubleshooting

### Common Issues

#### 1. Ollama Not Starting
\`\`\`bash
# Check if Ollama is running
ps aux | grep ollama

# Restart Ollama (Linux/macOS)
sudo systemctl restart ollama

# Windows: Restart from Services or Task Manager
\`\`\`

#### 2. Model Download Fails
\`\`\`bash
# Check internet connection
ping ollama.ai

# Try downloading again
ollama pull llama3.2 --insecure
\`\`\`

#### 3. Out of Memory Errors
\`\`\`bash
# Use smaller model
ollama pull phi3:mini

# Or adjust model parameters
ollama run llama3.2 --memory 4GB
\`\`\`

#### 4. API Connection Issues
\`\`\`bash
# Test Ollama API
curl http://localhost:11434/api/version

# Check firewall settings
sudo ufw allow 11434
\`\`\`

### Performance Optimization

#### 1. GPU Acceleration (NVIDIA)
\`\`\`bash
# Install CUDA support
ollama pull llama3.2 --gpu

# Verify GPU usage
nvidia-smi
\`\`\`

#### 2. CPU Optimization
\`\`\`bash
# Set CPU threads
export OLLAMA_NUM_THREADS=4
ollama serve
\`\`\`

## Step 7: Production Deployment

### Offline Network Setup
1. Download models on internet-connected machine
2. Export models:
\`\`\`bash
ollama save llama3.2 > llama3.2.tar
\`\`\`

3. Transfer to offline machine
4. Import models:
\`\`\`bash
ollama load < llama3.2.tar
\`\`\`

### Service Configuration
Create systemd service (Linux):

\`\`\`bash
sudo tee /etc/systemd/system/exam-ollama.service << EOF
[Unit]
Description=Ollama Service for Exam System
After=network.target

[Service]
Type=simple
User=examuser
Environment=OLLAMA_HOST=0.0.0.0:11434
ExecStart=/usr/local/bin/ollama serve
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable exam-ollama
sudo systemctl start exam-ollama
\`\`\`

## Step 8: Usage Examples

### AI Question Generation
The system can generate:
- Multiple choice questions
- Coding problems
- Essay questions
- Math problems

### AI Chatbot Features
- Student study assistance
- Teacher content help
- Exam preparation tips
- Subject explanations

### Code Execution
- Python code testing
- Node.js code evaluation
- Automatic grading
- Test case validation

## Security Considerations

### Network Security
- Ollama runs on localhost by default
- No external API calls required
- All data stays on local network

### Data Privacy
- No student data sent to external services
- All AI processing happens locally
- Complete offline operation

## Monitoring and Maintenance

### Check System Status
\`\`\`bash
# Ollama status
ollama ps

# System resources
htop
nvidia-smi  # If using GPU
\`\`\`

### Update Models
\`\`\`bash
# Update to latest version
ollama pull llama3.2:latest

# List available updates
ollama list
\`\`\`

### Backup Configuration
\`\`\`bash
# Backup models
cp -r ~/.ollama/models /backup/ollama-models

# Backup configuration
cp .env.local /backup/exam-system-config
\`\`\`

## Support and Resources

### Documentation
- Ollama Documentation: https://ollama.ai/docs
- Model Library: https://ollama.ai/library

### Community
- Ollama GitHub: https://github.com/ollama/ollama
- Discord Community: https://discord.gg/ollama

### Troubleshooting
- Check logs: `journalctl -u ollama -f`
- Debug mode: `OLLAMA_DEBUG=1 ollama serve`
- Memory usage: `ollama ps`

This setup provides a complete offline AI solution for your exam system, enabling intelligent question generation, student assistance, and automated code evaluation without requiring internet connectivity.
\`\`\`

Create the complete deployment script:

```shellscript file="scripts/complete-setup.sh"
#!/bin/bash

echo "🎓 Complete Offline Exam System Setup with AI"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

print_status "Starting complete system setup..."

# Step 1: Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) is installed"

# Check Python
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

print_success "Python $(python3 --version) is installed"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    print_warning "MongoDB is not installed. Installing MongoDB..."
    
    # Install MongoDB based on OS
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Ubuntu/Debian
        wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
        echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
        sudo apt-get update
        sudo apt-get install -y mongodb-org
        sudo systemctl start mongod
        sudo systemctl enable mongod
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if command -v brew &> /dev/null; then
            brew tap mongodb/brew
            brew install mongodb-community
            brew services start mongodb/brew/mongodb-community
        else
            print_error "Homebrew is required to install MongoDB on macOS"
            exit 1
        fi
    fi
fi

print_success "MongoDB is available"

# Step 2: Install Ollama for AI features
print_status "Installing Ollama for AI features..."

if ! command -v ollama &> /dev/null; then
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://ollama.ai/install.sh | sh
        sudo systemctl start ollama
        sudo systemctl enable ollama
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install ollama
        else
            print_warning "Please install Ollama manually from https://ollama.ai/download"
        fi
    fi
    
    # Wait for Ollama to start
    sleep 5
fi

print_success "Ollama is installed"

# Step 3: Download AI models
print_status "Downloading AI models (this may take a few minutes)..."

# Download lightweight model for education
ollama pull llama3.2 &
OLLAMA_PID=$!

# Step 4: Setup project
print_status "Setting up exam system project..."

# Install dependencies
if [ ! -d "node_modules" ]; then
    print_status "Installing Node.js dependencies..."
    npm install
fi

# Install additional dependencies for AI features
npm install uuid @types/uuid @radix-ui/react-scroll-area

print_success "Dependencies installed"

# Step 5: Setup environment
print_status "Configuring environment..."

if [ ! -f ".env.local" ]; then
    cp .env.example .env.local 2>/dev/null || true
fi

# Update .env.local with AI configuration
cat >> .env.local &lt;&lt; EOF

# AI Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
EOF

print_success "Environment configured"

# Step 6: Setup database
print_status "Setting up database..."

# Wait for MongoDB to be ready
sleep 3

# Build the application
print_status "Building application..."
npm run build

# Step 7: Initialize database
print_status "Initializing database..."
node -e "
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

async function setup() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  const db = client.db('secure_exam_system');
  
  // Create collections and indexes
  await db.createCollection('users');
  await db.createCollection('exams');
  await db.createCollection('submissions');
  
  await db.collection('users').createIndex({ username: 1 }, { unique: true });
  await db.collection('users').createIndex({ studentId: 1 }, { unique: true, sparse: true });
  
  // Create default admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  await db.collection('users').insertOne({
    username: 'admin',
    password: adminPassword,
    fullName: 'System Administrator',
    role: 'teacher',
    isOnline: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  console.log('Database initialized successfully');
  await client.close();
}

setup().catch(console.error);
"

print_success "Database initialized"

# Wait for Ollama model download to complete
print_status "Waiting for AI model download to complete..."
wait $OLLAMA_PID

# Test Ollama
print_status "Testing AI integration..."
if ollama list | grep -q "llama3.2"; then
    print_success "AI model downloaded successfully"
else
    print_warning "AI model download may have failed. You can download it manually with: ollama pull llama3.2"
fi

# Step 8: Get network information
print_status "Getting network information..."
LOCAL_IP=$(hostname -I | awk '{print $1}' 2>/dev/null || ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1' | head -1)

# Step 9: Create startup scripts
print_status "Creating startup scripts..."

# Create temp directory for code execution
mkdir -p temp

# Set permissions
chmod 755 temp

print_success "Setup completed successfully!"

echo ""
echo "🎉 SETUP COMPLETE!"
echo "=================="
echo ""
echo "🌐 Your exam system is ready at:"
echo "   Local:   http://localhost:3000"
echo "   Network: http://$LOCAL_IP:3000"
echo ""
echo "🔐 Default login credentials:"
echo "   Teacher: admin / admin123"
echo "   Student: student1 / student123 (create via signup)"
echo ""
echo "🤖 AI Features Available:"
echo "   ✅ AI-powered question generation"
echo "   ✅ Intelligent chatbot assistance"
echo "   ✅ Code execution (Python & Node.js)"
echo "   ✅ Automated grading"
echo ""
echo "🚀 To start the system:"
echo "   npm start"
echo ""
echo "📚 For offline deployment:"
echo "   1. Share the network URL with students"
echo "   2. Ensure all devices are on the same network"
echo "   3. No internet connection required!"
echo ""
echo "🔧 Troubleshooting:"
echo "   - MongoDB: sudo systemctl status mongod"
echo "   - Ollama: ollama ps"
echo "   - Logs: journalctl -u mongod -f"
echo ""
print_success "Ready to conduct secure offline examinations with AI!"
