# Complete Deployment Guide for Offline Exam System

## 🚀 Quick Start (5 Minutes)

### Option 1: Using Cloud MongoDB (For Testing)
\`\`\`bash
# 1. Clone and install
git clone <repository>
cd secure-offline-exam-system
npm install

# 2. Setup environment
cp .env.example .env.local
# Edit .env.local with your MongoDB URI

# 3. Initialize system
npm run dev
# Visit http://localhost:3000/setup

# 4. Start using
# Visit http://localhost:3000
\`\`\`

### Option 2: Complete Offline Setup (Production)
\`\`\`bash
# 1. Install MongoDB locally
# 2. Clone and install project
# 3. Configure for local MongoDB
# 4. Deploy on teacher's PC
# 5. Setup network for students
\`\`\`

## 📋 Detailed Setup Instructions

### Step 1: System Requirements

#### Teacher's PC (Server)
- **OS**: Windows 10/11, macOS, or Linux
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Wi-Fi capability or Ethernet
- **Software**: Node.js 18+, MongoDB 6+

#### Student Devices
- **Any device** with a modern web browser
- **Network**: Wi-Fi connection to teacher's network
- **No software installation** required

### Step 2: Install Prerequisites

#### Install Node.js
\`\`\`bash
# Windows: Download from nodejs.org
# macOS: 
brew install node

# Linux (Ubuntu/Debian):
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
\`\`\`

#### Install MongoDB

##### Windows:
1. Download MongoDB Community Server from mongodb.com
2. Run installer with default settings
3. Start MongoDB service

##### macOS:
\`\`\`bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
\`\`\`

##### Linux (Ubuntu/Debian):
\`\`\`bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
\`\`\`

### Step 3: Project Setup

#### Download and Install
\`\`\`bash
# Clone the project
git clone <your-repository-url>
cd secure-offline-exam-system

# Install dependencies
npm install
\`\`\`

#### Configure Environment
\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local for local MongoDB
nano .env.local
\`\`\`

**For Offline Use (.env.local):**
\`\`\`env
# Local MongoDB (Offline)
MONGODB_URI=mongodb://localhost:27017/secure_exam_system

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=3000
NODE_ENV=production

# Network Settings
NEXT_PUBLIC_API_URL=http://192.168.1.100:3000
\`\`\`

#### Initialize Database
\`\`\`bash
# Setup local MongoDB
npm run setup

# Seed with sample data
npm run seed
\`\`\`

#### Build and Start
\`\`\`bash
# Build for production
npm run build

# Start the server
npm start
\`\`\`

### Step 4: Network Configuration

#### Option A: Create Wi-Fi Hotspot

##### Windows:
\`\`\`cmd
# Open Command Prompt as Administrator
netsh wlan set hostednetwork mode=allow ssid="ExamNetwork" key="exampass123"
netsh wlan start hostednetwork

# Share internet connection (optional)
# Go to Network Settings > Change adapter options
# Right-click your internet connection > Properties > Sharing
# Check "Allow other network users to connect"
\`\`\`

##### macOS:
\`\`\`bash
# System Preferences > Sharing > Internet Sharing
# Share from: Ethernet/Wi-Fi
# To computers using: Wi-Fi
# Configure Wi-Fi options with network name and password
\`\`\`

##### Linux (Ubuntu):
\`\`\`bash
# Install hostapd
sudo apt-get install hostapd dnsmasq

# Configure hostapd
sudo nano /etc/hostapd/hostapd.conf

# Add configuration:
interface=wlan0
driver=nl80211
ssid=ExamNetwork
hw_mode=g
channel=7
wmm_enabled=0
macaddr_acl=0
auth_algs=1
ignore_broadcast_ssid=0
wpa=2
wpa_passphrase=exampass123
wpa_key_mgmt=WPA-PSK
wpa_pairwise=TKIP
rsn_pairwise=CCMP

# Start services
sudo systemctl enable hostapd
sudo systemctl start hostapd
\`\`\`

#### Option B: Use Existing Network
1. Connect teacher's PC to existing Wi-Fi/LAN
2. Find the PC's IP address:
   \`\`\`bash
   # Windows
   ipconfig
   
   # macOS/Linux
   ifconfig
   \`\`\`
3. Note the IP address (e.g., 192.168.1.100)
4. Update .env.local with correct IP

### Step 5: Student Access Setup

#### Share Network Details with Students
- **Network Name**: ExamNetwork (or existing network)
- **Password**: exampass123 (or existing password)
- **Exam URL**: http://192.168.1.100:3000 (replace with actual IP)

#### Student Instructions
1. Connect to the Wi-Fi network
2. Open web browser
3. Go to the provided URL
4. Register/Login with provided credentials
5. Take available exams

### Step 6: System Administration

#### Default Login Credentials
- **Teacher**: admin / admin123
- **Students**: student1, student2, student3 / student123

#### Change Default Passwords
\`\`\`bash
# Access the system as admin
# Go to user management
# Update passwords for security
\`\`\`

#### Monitor System
\`\`\`bash
# Check MongoDB status
sudo systemctl status mongod

# Check application logs
npm run dev  # Development mode with logs

# Monitor network connections
netstat -an | grep :3000
\`\`\`

## 🔧 Troubleshooting

### Common Issues

#### MongoDB Connection Failed
\`\`\`bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if stopped
sudo systemctl start mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
\`\`\`

#### Students Can't Access Server
\`\`\`bash
# Check firewall settings
sudo ufw allow 3000

# Windows Firewall
# Add inbound rule for port 3000

# Verify server is running
netstat -an | grep :3000
\`\`\`

#### Network Issues
\`\`\`bash
# Check IP address
ipconfig  # Windows
ifconfig  # macOS/Linux

# Test connectivity
ping 192.168.1.100  # From student device

# Check Wi-Fi hotspot
netsh wlan show hostednetwork  # Windows
\`\`\`

### Performance Optimization

#### For Large Classes (50+ Students)
\`\`\`bash
# Increase MongoDB connection pool
# Edit .env.local
MONGODB_MAX_POOL_SIZE=50

# Optimize Node.js
NODE_OPTIONS="--max-old-space-size=4096"
\`\`\`

#### Network Optimization
\`\`\`bash
# Use 5GHz Wi-Fi if available
# Limit concurrent connections
# Use wired connection for teacher's PC
\`\`\`

## 🔒 Security Considerations

### Network Security
- Use strong Wi-Fi passwords
- Enable WPA2/WPA3 encryption
- Disable internet sharing if not needed
- Monitor connected devices

### Application Security
- Change default passwords immediately
- Use strong JWT secrets
- Regular database backups
- Monitor user sessions

### Data Protection
\`\`\`bash
# Backup database
mongodump --db secure_exam_system --out backup/

# Restore database
mongorestore --db secure_exam_system backup/secure_exam_system/
\`\`\`

## 📊 System Monitoring

### Real-time Monitoring
- Student connection status
- Exam submission progress
- System resource usage
- Network activity

### Logging
\`\`\`bash
# Application logs
tail -f logs/application.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log

# System logs
journalctl -u mongod -f
\`\`\`

## 🚀 Production Deployment

### Automated Startup
\`\`\`bash
# Create systemd service (Linux)
sudo nano /etc/systemd/system/exam-system.service

[Unit]
Description=Secure Exam System
After=network.target mongod.service

[Service]
Type=simple
User=examuser
WorkingDirectory=/home/examuser/secure-offline-exam-system
ExecStart=/usr/bin/npm start
Restart=always

[Install]
WantedBy=multi-user.target

# Enable service
sudo systemctl enable exam-system
sudo systemctl start exam-system
\`\`\`

### Windows Service
\`\`\`cmd
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start npm --name "exam-system" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 startup
pm2 startup
\`\`\`

## 📱 Mobile Device Support

### Responsive Design
- Optimized for tablets and smartphones
- Touch-friendly interface
- Adaptive layouts
- Offline capability

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🎯 Best Practices

### Before Exam Day
1. Test complete setup with sample students
2. Verify all devices can connect
3. Check exam content and timing
4. Prepare backup power solutions
5. Have technical support ready

### During Exams
1. Monitor student connections
2. Watch for technical issues
3. Have backup devices ready
4. Monitor system performance
5. Ensure network stability

### After Exams
1. Export results immediately
2. Backup all data
3. Generate reports
4. Archive exam data
5. Clean up temporary files

This system provides a complete, secure, and reliable solution for offline digital examinations, perfect for educational institutions and training organizations.
