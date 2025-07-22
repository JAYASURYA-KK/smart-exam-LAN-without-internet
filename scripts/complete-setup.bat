@echo off
echo 🎓 Complete Offline Exam System Setup with AI
echo ==============================================

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18 or higher.
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Check Python
where python >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    pause
    exit /b 1
)

echo ✅ Python is installed

REM Check MongoDB
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="1" (
    echo 📦 Starting MongoDB...
    net start MongoDB
    timeout /t 3 /nobreak >nul
)

echo ✅ MongoDB is running

REM Install Ollama (manual step for Windows)
where ollama >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo ⚠️  Please install Ollama manually from https://ollama.ai/download
    echo    After installation, run: ollama pull llama3.2
    pause
)

REM Install dependencies
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

npm install uuid @types/uuid @radix-ui/react-scroll-area

REM Setup environment
if not exist ".env.local" (
    copy .env.example .env.local >nul 2>nul
)

echo. >> .env.local
echo # AI Configuration >> .env.local
echo OLLAMA_BASE_URL=http://localhost:11434 >> .env.local
echo OLLAMA_MODEL=llama3.2 >> .env.local

REM Create temp directory
if not exist "temp" mkdir temp

REM Build application
echo 🔨 Building application...
npm run build

REM Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4 Address"') do set LOCAL_IP=%%a
set LOCAL_IP=%LOCAL_IP: =%

echo.
echo 🎉 SETUP COMPLETE!
echo ==================
echo.
echo 🌐 Your exam system will be available at:
echo    Local:   http://localhost:3000
echo    Network: http://%LOCAL_IP%:3000
echo.
echo 🔐 Default login credentials:
echo    Teacher: admin / admin123
echo    Student: student1 / student123 (create via signup)
echo.
echo 🤖 AI Features Available:
echo    ✅ AI-powered question generation
echo    ✅ Intelligent chatbot assistance  
echo    ✅ Code execution (Python ^& Node.js)
echo    ✅ Automated grading
echo.
echo 🚀 To start the system:
echo    npm start
echo.
echo 📚 Manual steps required:
echo    1. Install Ollama from https://ollama.ai/download
echo    2. Run: ollama pull llama3.2
echo    3. Visit http://localhost:3000/setup to initialize database
echo.
echo ✅ Ready for secure offline examinations with AI!
pause
