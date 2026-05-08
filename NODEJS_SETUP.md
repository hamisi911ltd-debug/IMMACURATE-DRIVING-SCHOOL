# Node.js Backend Setup Guide

## Overview

Your DSMS has been converted to a full Node.js application with Express.js backend. This provides:
- Server-side rendering with EJS templates
- Session-based authentication
- SQLite database with proper ORM
- RESTful API endpoints
- Production-ready architecture

## Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **SQLite3** - Database
- **EJS** - Template engine
- **bcryptjs** - Password hashing
- **express-session** - Session management

### Security
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **express-rate-limit** - Rate limiting
- **express-validator** - Input validation

### Development
- **Nodemon** - Auto-restart on changes
- **Morgan** - HTTP request logger
- **dotenv** - Environment variables

## Installation

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file with your settings
nano .env
```

### Step 3: Initialize Database
```bash
# Create database and tables
npm run init-db

# Seed with initial data
npm run seed-db
```

### Step 4: Start Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

## Project Structure

```
DSMS/
├── server.js                 # Main server file
├── package.json              # Dependencies
├── .env                      # Environment variables
├── .env.example              # Environment template
│
├── config/
│   └── database.js           # Database configuration
│
├── middleware/
│   ├── auth.js               # Authentication middleware
│   ├── errorHandler.js       # Error handling
│   └── validation.js         # Input validation
│
├── routes/
│   ├── auth.js               # Authentication routes
│   ├── dashboard.js          # Dashboard routes
│   ├── students.js           # Student routes
│   ├── courses.js            # Course routes
│   ├── lessons.js            # Lesson routes
│   ├── payments.js           # Payment routes
│   ├── messages.js           # Message routes
│   ├── reports.js            # Report routes
│   └── api.js                # API routes
│
├── models/
│   ├── Student.js            # Student model
│   ├── Course.js             # Course model
│   ├── Lesson.js             # Lesson model
│   ├── Payment.js            # Payment model
│   └── Message.js            # Message model
│
├── controllers/
│   ├── authController.js     # Auth logic
│   ├── studentController.js  # Student logic
│   ├── courseController.js   # Course logic
│   └── ...
│
├── views/
│   ├── layouts/
│   │   └── main.ejs          # Main layout
│   ├── partials/
│   │   ├── header.ejs        # Header partial
│   │   ├── sidebar.ejs       # Sidebar partial
│   │   └── footer.ejs        # Footer partial
│   ├── login.ejs             # Login page
│   ├── dashboard.ejs         # Dashboard page
│   ├── students/
│   │   ├── list.ejs          # Students list
│   │   ├── view.ejs          # Student details
│   │   └── edit.ejs          # Edit student
│   └── ...
│
├── public/
│   ├── css/
│   │   └── styles.css        # Styles
│   ├── js/
│   │   └── app.js            # Client-side JS
│   └── assets/
│       └── images/           # Images
│
├── database/
│   ├── dsms.db               # SQLite database
│   ├── schema.sql            # Database schema
│   └── seed_data.sql         # Seed data
│
└── scripts/
    ├── init-database.js      # Database initialization
    └── seed-database.js      # Data seeding
```

## Features

### Authentication
- ✅ Login/Logout
- ✅ Session management
- ✅ Password hashing (bcrypt)
- ✅ Role-based access control
- ✅ Remember me functionality

### Dashboard
- ✅ Real-time statistics
- ✅ Recent activities
- ✅ Quick actions
- ✅ Charts and graphs

### Student Management
- ✅ Register students
- ✅ View student list
- ✅ Student details
- ✅ Edit student info
- ✅ Track progress
- ✅ Enrollment management

### Course Management
- ✅ List courses
- ✅ Course details
- ✅ Enrollment tracking
- ✅ Course materials

### Lesson Scheduling
- ✅ Schedule lessons
- ✅ View schedule
- ✅ Assign instructors
- ✅ Assign vehicles
- ✅ Track attendance

### Payment Processing
- ✅ Record payments
- ✅ Generate receipts
- ✅ Payment history
- ✅ Balance tracking
- ✅ Multiple payment methods

### Messaging
- ✅ Send messages
- ✅ Broadcast messages
- ✅ Message history
- ✅ Templates

### Reports
- ✅ Student reports
- ✅ Revenue reports
- ✅ Attendance reports
- ✅ Performance reports
- ✅ Export to PDF/Excel

## API Endpoints

### Authentication
- `POST /auth/login` - Login
- `GET /auth/logout` - Logout

### Students
- `GET /students` - List students
- `GET /students/:id` - View student
- `POST /students` - Create student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

### Courses
- `GET /courses` - List courses
- `GET /courses/:id` - View course
- `POST /courses` - Create course
- `PUT /courses/:id` - Update course

### Lessons
- `GET /lessons` - List lessons
- `GET /lessons/:id` - View lesson
- `POST /lessons` - Schedule lesson
- `PUT /lessons/:id` - Update lesson
- `DELETE /lessons/:id` - Cancel lesson

### Payments
- `GET /payments` - List payments
- `GET /payments/:id` - View payment
- `POST /payments` - Record payment

### Messages
- `GET /messages` - List messages
- `POST /messages` - Send message
- `POST /messages/broadcast` - Broadcast message

### Reports
- `GET /reports/students` - Student report
- `GET /reports/revenue` - Revenue report
- `GET /reports/attendance` - Attendance report
- `GET /reports/performance` - Performance report

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=3000
HOST=localhost

# Database
DB_PATH=./database/dsms.db

# Session
SESSION_SECRET=your-secret-key
SESSION_NAME=dsms_session
SESSION_MAX_AGE=86400000

# Security
BCRYPT_ROUNDS=10

# Application
APP_NAME=Immacurate Driving School Management System
APP_VERSION=1.0.0

# Admin
DEFAULT_ADMIN_EMAIL=hamisi.911.ltd@gmail.com
DEFAULT_ADMIN_PASSWORD=911Hamisi.

# CORS
CORS_ORIGIN=*

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Development

### Running in Development Mode
```bash
npm run dev
```

This will:
- Start server with nodemon
- Auto-restart on file changes
- Enable detailed logging
- Show stack traces

### Running in Production Mode
```bash
npm start
```

This will:
- Start server with node
- Minimize logging
- Hide stack traces
- Enable compression

## Database Management

### Initialize Database
```bash
npm run init-db
```

Creates all tables and indexes.

### Seed Database
```bash
npm run seed-db
```

Adds:
- Default admin user
- 6 courses
- 3 instructors
- 3 vehicles

### Backup Database
```bash
# Copy database file
cp database/dsms.db database/backup-$(date +%Y%m%d).db
```

### Reset Database
```bash
# Delete database
rm database/dsms.db

# Reinitialize
npm run init-db
npm run seed-db
```

## Testing

### Manual Testing
1. Start server: `npm run dev`
2. Open browser: `http://localhost:3000`
3. Login with default credentials
4. Test all features

### API Testing
```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hamisi.911.ltd@gmail.com","password":"911Hamisi."}'

# List students
curl http://localhost:3000/api/students/list
```

## Deployment

### Option 1: Traditional Server (VPS, Dedicated)

**1. Install Node.js on server**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**2. Clone repository**
```bash
git clone https://github.com/hamisi911ltd-debug/IMMACURATE-DRIVING-SCHOOL.git
cd IMMACURATE-DRIVING-SCHOOL
```

**3. Install dependencies**
```bash
npm install --production
```

**4. Configure environment**
```bash
cp .env.example .env
nano .env
```

**5. Initialize database**
```bash
npm run init-db
npm run seed-db
```

**6. Start with PM2**
```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start server.js --name dsms

# Save PM2 configuration
pm2 save

# Setup startup script
pm2 startup
```

**7. Configure Nginx (optional)**
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Option 2: Heroku

**1. Create Heroku app**
```bash
heroku create immacurate-dsms
```

**2. Add buildpack**
```bash
heroku buildpacks:set heroku/nodejs
```

**3. Set environment variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set SESSION_SECRET=your-secret-key
```

**4. Deploy**
```bash
git push heroku main
```

**5. Initialize database**
```bash
heroku run npm run init-db
heroku run npm run seed-db
```

### Option 3: Docker

**1. Create Dockerfile**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

**2. Build image**
```bash
docker build -t dsms .
```

**3. Run container**
```bash
docker run -d -p 3000:3000 --name dsms dsms
```

## Security

### Best Practices
- ✅ Use HTTPS in production
- ✅ Set strong SESSION_SECRET
- ✅ Enable rate limiting
- ✅ Use helmet for security headers
- ✅ Validate all inputs
- ✅ Hash passwords with bcrypt
- ✅ Use prepared statements (SQL injection protection)
- ✅ Enable CORS only for trusted origins
- ✅ Keep dependencies updated

### Production Checklist
- [ ] Set NODE_ENV=production
- [ ] Use strong SESSION_SECRET
- [ ] Enable HTTPS
- [ ] Configure firewall
- [ ] Set up backups
- [ ] Enable logging
- [ ] Monitor errors
- [ ] Set up alerts

## Troubleshooting

### Server won't start
```bash
# Check if port is in use
lsof -i :3000

# Kill process using port
kill -9 <PID>

# Try different port
PORT=3001 npm start
```

### Database errors
```bash
# Check database file exists
ls -la database/dsms.db

# Reinitialize database
npm run init-db
```

### Session issues
```bash
# Clear sessions
rm -rf sessions/

# Restart server
npm restart
```

## Support

### Documentation
- `README.md` - Project overview
- `NODEJS_SETUP.md` - This file
- `API_DOCUMENTATION.md` - API reference

### Logs
```bash
# View logs
tail -f logs/app.log

# PM2 logs
pm2 logs dsms
```

### Database
```bash
# Open SQLite shell
sqlite3 database/dsms.db

# Run query
sqlite3 database/dsms.db "SELECT * FROM students;"
```

## Next Steps

1. **Install dependencies:** `npm install`
2. **Configure environment:** Edit `.env`
3. **Initialize database:** `npm run init-db`
4. **Seed data:** `npm run seed-db`
5. **Start server:** `npm run dev`
6. **Open browser:** `http://localhost:3000`
7. **Login:** hamisi.911.ltd@gmail.com / 911Hamisi.

Your DSMS is now running on Node.js! 🚀
