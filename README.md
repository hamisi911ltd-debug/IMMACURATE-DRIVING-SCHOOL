# 🚗 Immacurate Driving School Management System (DSMS)

A modern, full-stack driving school management system built with **React**, **Cloudflare Pages**, **Cloudflare Workers**, and **Cloudflare D1 Database**.

## ✨ Features

### 👨‍🎓 Student Management
- Register new students
- Track student progress
- View student details and history
- Manage enrollments

### 📚 Course Management
- Multiple course types
- Track course progress
- Theory and practical hours
- Course pricing and duration

### 📅 Lesson Scheduling
- Schedule driving lessons
- Assign instructors and vehicles
- Track lesson completion
- Lesson history

### 💰 Payment Tracking
- Record payments
- Track balances
- Payment history
- Receipt generation

### 💬 Messaging System
- Send individual messages
- Broadcast to all students
- Message history

### 📊 Reports & Analytics
- Student reports
- Revenue reports
- Attendance tracking
- Performance analytics

### 🚙 Vehicle & Instructor Management
- Track vehicles
- Manage instructors
- Availability scheduling

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

### Backend
- **Cloudflare Workers** - Serverless functions
- **Cloudflare Pages** - Static hosting
- **Cloudflare D1** - SQLite database

### Development
- **ESLint** - Code linting
- **Wrangler** - Cloudflare CLI

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 9+
- Cloudflare account
- Wrangler CLI

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/immacurate-dsms.git
cd immacurate-dsms
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Wrangler
```bash
npm install -g wrangler
wrangler login
```

### 4. Create D1 Database
```bash
npm run db:create
```

Copy the database ID and update `wrangler.toml`.

### 5. Initialize Database
```bash
npm run db:init
npm run db:seed
```

### 6. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🚀 Deployment

### Quick Deploy
```bash
npm run deploy
```

### Detailed Deployment Guide
See [CLOUDFLARE_REACT_DEPLOYMENT.md](./CLOUDFLARE_REACT_DEPLOYMENT.md) for complete instructions.

### Build for Production
```bash
npm run build
```

### Deploy to Cloudflare Pages
```bash
npm run cf:deploy
```

## 🔐 Default Login

After deployment, create an admin user:

```bash
wrangler d1 execute immacurate-dsms-db --command="
INSERT INTO system_users (
  user_id, first_name, last_name, email, password_hash, role, status
) VALUES (
  'admin-001', 'Admin', 'User', 'admin@immacurate.com', 
  'YWRtaW4xMjM=', 'admin', 'active'
)"
```

**Login Credentials:**
- Email: `admin@immacurate.com`
- Password: `admin123`

⚠️ **Change password immediately after first login!**

## 📁 Project Structure

```
immacurate-dsms/
├── src/                      # React application
│   ├── components/           # Reusable components
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── pages/               # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Students.jsx
│   │   ├── Courses.jsx
│   │   └── ...
│   ├── services/            # API services
│   │   └── api.js
│   ├── store/               # State management
│   │   └── authStore.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── functions/               # Cloudflare Workers
│   ├── api/                 # API endpoints
│   │   ├── auth/
│   │   ├── students/
│   │   ├── courses/
│   │   ├── lessons/
│   │   ├── payments/
│   │   └── ...
│   ├── _middleware.js       # Global middleware
│   └── _auth.js             # Auth utilities
├── database/                # Database files
│   ├── schema.sql           # Database schema
│   ├── seed_data.sql        # Sample data
│   └── quick_setup.sql      # Quick setup script
├── public/                  # Static assets
├── dist/                    # Build output
├── wrangler.toml            # Cloudflare config
├── vite.config.js           # Vite config
├── package.json             # Dependencies
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```env
VITE_API_URL=/api
VITE_APP_NAME=Immacurate DSMS
VITE_APP_VERSION=1.0.0
```

### Wrangler Configuration

Edit `wrangler.toml`:
```toml
name = "immacurate-dsms"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "immacurate-dsms-db"
database_id = "your-database-id"
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start Vite dev server
npm run cf:dev           # Start Cloudflare Pages dev server

# Build
npm run build            # Build for production
npm run preview          # Preview production build

# Deploy
npm run deploy           # Build and deploy to Cloudflare
npm run cf:deploy        # Deploy to Cloudflare Pages

# Database
npm run db:create        # Create D1 database
npm run db:init          # Initialize schema
npm run db:seed          # Seed with data
npm run db:query         # Run custom query

# Code Quality
npm run lint             # Run ESLint
```

## 🗄️ Database Schema

The system uses SQLite (D1) with the following main tables:

- `students` - Student information
- `courses` - Course catalog
- `instructors` - Instructor details
- `vehicles` - Vehicle fleet
- `lessons` - Lesson scheduling
- `payments` - Payment records
- `messages` - Communication logs
- `system_users` - Admin users

See [database/schema.sql](./database/schema.sql) for complete schema.

## 🔒 Security

- JWT-based authentication
- Password hashing
- CORS protection
- Rate limiting
- SQL injection prevention
- XSS protection

## 🐛 Troubleshooting

### Build Issues
```bash
rm -rf node_modules dist
npm install
npm run build
```

### Database Issues
```bash
# Verify database
wrangler d1 execute immacurate-dsms-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### Deployment Issues
```bash
# Check logs
wrangler pages deployment tail
```

## 📚 Documentation

- [Cloudflare Pages](https://developers.cloudflare.com/pages)
- [Cloudflare D1](https://developers.cloudflare.com/d1)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

**Immacurate Driving School**

## 🙏 Acknowledgments

- Cloudflare for amazing infrastructure
- React team for the excellent framework
- All contributors and users

## 📞 Support

For support, email support@immacurate.com or open an issue on GitHub.

---

Made with ❤️ by Immacurate Driving School
