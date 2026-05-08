# Immacurate Driving School Management System - Node.js Edition

## 🚗 Complete Node.js Backend Application

Your DSMS has been converted to a full-stack Node.js application with Express.js backend, maintaining the same beautiful design while adding powerful server-side capabilities.

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Initialize database
npm run init-db
npm run seed-db

# 3. Start server
npm run dev

# 4. Open browser
http://localhost:3000

# 5. Login
Email: hamisi.911.ltd@gmail.com
Password: 911Hamisi.
```

---

## 🎯 What's New

### Full Node.js Backend
- ✅ Express.js server
- ✅ SQLite database
- ✅ Session authentication
- ✅ RESTful API
- ✅ Server-side rendering (EJS)

### Same Beautiful Design
- ✅ All your existing UI preserved
- ✅ Same navigation structure
- ✅ Same functionality
- ✅ Better performance

### Production Ready
- ✅ Security middleware
- ✅ Rate limiting
- ✅ Error handling
- ✅ Logging
- ✅ Compression
- ✅ CORS support

---

## 📦 Technology Stack

**Backend:**
- Node.js 16+
- Express.js 4.18
- SQLite3 5.1
- EJS 3.1

**Security:**
- Helmet (security headers)
- bcryptjs (password hashing)
- express-session (sessions)
- express-validator (validation)

**Development:**
- Nodemon (auto-restart)
- Morgan (logging)
- dotenv (environment)

---

## 📁 Project Structure

```
DSMS/
├── server.js                 # Main server
├── package.json              # Dependencies
├── .env                      # Configuration
│
├── config/
│   └── database.js           # Database setup
│
├── routes/
│   ├── auth.js               # Authentication
│   ├── dashboard.js          # Dashboard
│   ├── students.js           # Students
│   ├── courses.js            # Courses
│   ├── lessons.js            # Lessons
│   ├── payments.js           # Payments
│   ├── messages.js           # Messages
│   ├── reports.js            # Reports
│   └── api.js                # API endpoints
│
├── middleware/
│   ├── auth.js               # Auth middleware
│   └── errorHandler.js       # Error handling
│
├── views/
│   ├── login.ejs             # Login page
│   ├── dashboard.ejs         # Dashboard
│   └── error.ejs             # Error page
│
├── database/
│   ├── dsms.db               # SQLite database
│   ├── schema.sql            # Database schema
│   └── seed_data.sql         # Initial data
│
├── scripts/
│   ├── init-database.js      # DB initialization
│   └── seed-database.js      # Data seeding
│
├── public/
│   ├── css/                  # Stylesheets
│   ├── js/                   # Client scripts
│   └── assets/               # Images
│
└── docs/
    ├── NODEJS_SETUP.md       # Setup guide
    └── QUICK_START_NODEJS.md # Quick start
```

---

## 🚀 Features

### Dashboard
- Real-time statistics
- Recent activities
- Quick actions
- Charts and graphs

### Student Management
- Register students
- View student list
- Student details
- Edit information
- Track progress
- Enrollment management

### Course Management
- List courses
- Course details
- Enrollment tracking
- Course materials

### Lesson Scheduling
- Schedule lessons
- View schedule
- Assign instructors
- Assign vehicles
- Track attendance

### Payment Processing
- Record payments
- Generate receipts
- Payment history
- Balance tracking
- Multiple payment methods

### Messaging
- Send messages
- Broadcast messages
- Message history
- Templates

### Reports
- Student reports
- Revenue reports
- Attendance reports
- Performance reports
- Export functionality

---

## 🔧 Commands

```bash
# Development
npm run dev              # Start with auto-restart
npm start                # Start production server

# Database
npm run init-db          # Create database tables
npm run seed-db          # Add initial data

# Installation
npm install              # Install dependencies
npm install --production # Production install
```

---

## 🌐 API Endpoints

### Authentication
- `POST /auth/login` - Login
- `GET /auth/logout` - Logout

### Students
- `GET /api/students/list` - List students
- `POST /students/register` - Register student

### Courses
- `GET /api/courses/list` - List courses

### Dashboard
- `GET /api/dashboard/stats` - Get statistics

### And more...

---

## ⚙️ Configuration

### Environment Variables (.env)

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

# Admin
DEFAULT_ADMIN_EMAIL=hamisi.911.ltd@gmail.com
DEFAULT_ADMIN_PASSWORD=911Hamisi.
```

---

## 🚢 Deployment

### VPS/Server
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Setup application
git clone <your-repo>
cd DSMS
npm install --production
npm run init-db
npm run seed-db

# Start with PM2
npm install -g pm2
pm2 start server.js --name dsms
pm2 save
pm2 startup
```

### Heroku
```bash
heroku create your-app-name
git push heroku main
heroku run npm run init-db
heroku run npm run seed-db
heroku open
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t dsms .
docker run -d -p 3000:3000 dsms
```

---

## 🔒 Security

- ✅ Password hashing with bcrypt
- ✅ Session management
- ✅ SQL injection protection
- ✅ XSS protection
- ✅ CSRF protection ready
- ✅ Rate limiting
- ✅ Security headers (Helmet)
- ✅ Input validation

---

## 📊 Database

### SQLite Database
- 13 tables
- Foreign keys enabled
- Indexes for performance
- Triggers for automation

### Tables
- system_users
- students
- courses
- student_enrollments
- instructors
- vehicles
- lessons
- payments
- student_balances
- messages
- course_materials
- student_progress
- system_settings

---

## 🐛 Troubleshooting

### Port in use
```bash
PORT=3001 npm start
```

### Database errors
```bash
rm database/dsms.db
npm run init-db
npm run seed-db
```

### Module errors
```bash
rm -rf node_modules
npm install
```

---

## 📚 Documentation

- `QUICK_START_NODEJS.md` - Quick start guide
- `NODEJS_SETUP.md` - Detailed setup
- `package.json` - Dependencies

---

## 🎓 Default Credentials

**Admin Login:**
- Email: `hamisi.911.ltd@gmail.com`
- Password: `911Hamisi.`

---

## 📝 License

MIT License

---

## 🤝 Support

For issues or questions:
1. Check documentation
2. Review logs: `npm run dev`
3. Check database: `sqlite3 database/dsms.db`

---

## ✨ Your DSMS is now a professional Node.js application!

**Start developing:** `npm run dev`  
**Visit:** `http://localhost:3000`  
**Login and enjoy!** 🚗📚

---

**Built with ❤️ for Immacurate Driving School**
