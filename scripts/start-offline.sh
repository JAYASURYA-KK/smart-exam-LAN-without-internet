#!/bin/bash

# Offline Exam System Startup Script
echo "🎓 Starting Secure Offline Exam System..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "📦 Starting MongoDB..."
    sudo systemctl start mongod
    sleep 3
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building application..."
npm run build

# Get local IP address
LOCAL_IP=$(hostname -I | awk '{print $1}')

echo "🌐 Server will be available at:"
echo "   Local: http://localhost:3000"
echo "   Network: http://$LOCAL_IP:3000"
echo ""
echo "📋 Share the network URL with students!"
echo "🔐 Default credentials:"
echo "   Teacher: admin / admin123"
echo "   Student: student1 / student123"
echo ""

# Start the server
echo "🚀 Starting server..."
npm start
