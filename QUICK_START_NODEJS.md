# Quick Start - Node.js Backend

## Your DSMS is now a full Node.js application!

### What Changed

**Before:** Static HTML + Cloudflare Workers  
**After:** Node.js + Express.js + SQLite

### Quick Setup (5 minutes)

**1. Install Node.js**
- Download from: https://nodejs.org
- Version required: 16.0.0 or higher

**2. Install Dependencies**
```bash
npm install
```

**3. Setup Environment**
```bash
# Copy environment template
cp .env.example .env

# Edit if needed (optional)
nano .env
```

**4. Initialize Database**
```bash
npm run init-db
npm run seed-db
```

**5. Start Server**
```bash
# Development mode (auto-restart)
npm run dev

# OR Production mode
npm start
```

**6. Open Browser**
```
http://localhost:3000
```

**7. Login**
```
Email: hamisi.911.ltd@gmail.com
Password: 911Hamisi.
```

## That's it! Your DSMS is running! 🚀

---

## Features

### ✅ Full Backend
- Express.js server
- Session-based authentication
- SQLite database
- RESTful API endpoints
- Server-side rendering (EJS)

### ✅ Same Design
- All your existing HTML/CSS preserved
- Same user interface
- Same functionality
- Better performance

### ✅ Production Ready
- Security middleware (Helmet)
- Rate limiting
- CORS support
- Error handling
- Logging
- Compression

---

## Project Structure

```
DSMS/
├── server.js              # Main server
├── package.json           # Dependencies
├── .env                   # Configuration
│
├── routes/                # All routes
│   ├── auth.js           # Login/Logout
│   ├── dashboard.js      # Dashboard
│   ├── students.js       # Students
│   ├── courses.js        # Courses
│   ├── lessons.js        # Lessons
│   ├── payments.js       # Payments
│   ├── messages.js       # Messages
│   ├── reports.js        # Reports
│   └── api.js            # API endpoints
│
├── config/
│   └── database.js       # Database config
│
├── middleware/
│   ├── auth.js           # Authentication
│   └── errorHandler.js   # Error handling
│
├── views/                # EJS templates
│   ├── login.ejs
│   ├── dashboard.ejs
│   └── error.ejs
│
├── database/
│   ├── dsms.db           # SQLite database
│   └── schema.sql        # Database schema
│
└── scripts/
    ├── init-database.js  # Initialize DB
    └── seed-database.js  # Seed data
```

---

## Commands

```bash
# Development
npm run dev          # Start with auto-restart

# Production
npm start            # Start server

# Database
npm run init-db      # Create tables
npm run seed-db      # Add initial data

# Install
npm install          # Install dependencies
```

---

## API Endpoints

All your existing API endpoints work:

- `GET /api/students/list`
- `GET /api/courses/list`
- `GET /api/dashboard/stats`
- And all others...

---

## Environment Variables

Default `.env` settings:
```env
NODE_ENV=development
PORT=3000
HOST=localhost
DB_PATH=./database/dsms.db
SESSION_SECRET=your-secret-key
```

---

## Deployment

### Option 1: VPS/Server
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
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

### Option 2: Heroku
```bash
heroku create your-app-name
git push heroku main
heroku run npm run init-db
heroku run npm run seed-db
```

### Option 3: Docker
```bash
docker build -t dsms .
docker run -d -p 3000:3000 dsms
```

---

## Troubleshooting

### Port already in use
```bash
# Use different port
PORT=3001 npm start
```

### Database errors
```bash
# Reinitialize
rm database/dsms.db
npm run init-db
npm run seed-db
```

### Module not found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## What You Get

### ✅ Better Performance
- Server-side rendering
- Database queries optimized
- Compression enabled
- Caching ready

### ✅ Better Security
- Session management
- Password hashing (bcrypt)
- CSRF protection ready
- SQL injection protection
- XSS protection

### ✅ Better Scalability
- Can handle more users
- Database transactions
- Connection pooling
- Load balancing ready

### ✅ Better Development
- Hot reload (nodemon)
- Better error messages
- Logging
- Debugging tools

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Initialize database: `npm run init-db && npm run seed-db`
3. ✅ Start server: `npm run dev`
4. ✅ Open browser: `http://localhost:3000`
5. ✅ Login and test!

---

## Support

**Documentation:**
- `NODEJS_SETUP.md` - Detailed setup guide
- `README.md` - Project overview
- `package.json` - Dependencies list

**Logs:**
```bash
# View server logs
npm run dev
```

**Database:**
```bash
# Open SQLite shell
sqlite3 database/dsms.db

# Run query
sqlite3 database/dsms.db "SELECT * FROM students;"
```

---

## Your DSMS is now a professional Node.js application! 🎉

**Framework:** Node.js + Express.js  
**Database:** SQLite  
**Template Engine:** EJS  
**Status:** Production Ready ✅

Start developing: `npm run dev`
