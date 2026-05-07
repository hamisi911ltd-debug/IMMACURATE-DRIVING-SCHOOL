# Driving School Management System (DSMS)

A modern, responsive web application for managing driving school operations with Cloudflare D1 database backend.

## Framework & Technology

This is a **Static HTML/CSS/JavaScript Application** with **Cloudflare D1 Database** backend!

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Cloudflare Workers + D1 Database
- **Database**: SQLite-compatible (Cloudflare D1)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: SVG icons (inline)
- **Storage**: Cloudflare D1 (replaces localStorage)
- **Responsive**: Mobile-first design

## Features

- **Dashboard**: Overview of students, courses, and revenue
- **Student Management**: Register and track student progress
- **Course Management**: Manage different driving course types
- **Schedule Management**: Lesson scheduling and calendar
- **Payment Tracking**: Record and monitor payments with receipts
- **Communication**: Message system for student communication
- **Reports**: Generate various business reports
- **User Management**: Admin and manager roles
- **Database Backend**: Persistent data storage with D1
- **Multi-User Support**: Multiple admins can access same data
- **Real-time Sync**: Changes visible immediately across devices

## Default Login

- **Username**: `hamisi.911.ltd@gmail.com`
- **Password**: `911Hamisi.`

## Database Schema

The system includes a comprehensive database schema with:

### Core Tables
- **system_users** - Admin, manager, instructor accounts
- **students** - Student profiles and information
- **courses** - Available driving courses
- **student_enrollments** - Course registrations
- **instructors** - Instructor profiles
- **vehicles** - School vehicle fleet
- **lessons** - Scheduled and completed lessons
- **payments** - Payment records and receipts
- **messages** - Internal messaging system
- **course_materials** - Course documents and videos
- **student_progress** - Learning progress tracking
- **system_settings** - Application configuration
- **audit_log** - System activity logging

### Database Features
- Foreign key constraints for data integrity
- Automatic timestamps and triggers
- Optimized indexes for performance
- Pre-built views for common queries
- Generated columns for calculated fields

## Cloudflare Deployment Options

Since this application uses Cloudflare D1 database, deploy using Cloudflare services:

### 1. Cloudflare Workers + D1 (Recommended)
- **Best for**: Full-stack application with database
- **Cost**: Free tier available
- **Features**: Serverless functions, SQL database, global edge deployment

### 2. Cloudflare Pages + Workers + D1
- **Best for**: Static frontend with API backend
- **Cost**: Free tier available
- **Features**: Static hosting, serverless API, database

## Database Setup

1. **Create D1 Database**:
   ```bash
   wrangler d1 create dsms-database
   ```

2. **Apply Schema**:
   ```bash
   wrangler d1 execute dsms-database --file=./database/schema.sql
   ```

3. **Seed Initial Data**:
   ```bash
   wrangler d1 execute dsms-database --file=./database/seed_data.sql
   ```

4. **Deploy Workers**:
   ```bash
   wrangler deploy
   ```

See `database/CLOUDFLARE_D1_SETUP.md` for detailed setup instructions.

## Project Structure

```
dsms/
├── index.html              # Main dashboard
├── login.html             # Login page
├── student-portal.html    # Student interface
├── css/
│   └── styles.css        # Additional styles
├── js/
│   └── app.js           # Application logic
├── components/          # Reusable components
├── content/            # Page content
├── pages/             # Individual pages
├── assets/           # Images and media
└── database/         # Database files
    ├── schema.sql           # Database schema
    ├── seed_data.sql        # Initial data
    ├── api_examples.js      # API implementation
    ├── CLOUDFLARE_D1_SETUP.md
    └── MIGRATION_GUIDE.md
```

## Setup Instructions

### Option 1: Database-Powered (Recommended)
1. **Setup Cloudflare D1 Database** (see `database/CLOUDFLARE_D1_SETUP.md`)
2. **Deploy Workers API** with database connections
3. **Deploy Frontend** to Cloudflare Pages
4. **Configure** custom domain (optional)
5. **Test** with default admin credentials

### Option 2: localStorage Only (Basic)
1. **Upload** all files to static hosting
2. **Set** `index.html` as the default page
3. **Access** the application and login
4. **Note**: Data will be stored locally in browser only

## Migration from localStorage

If you have existing data in localStorage, see `database/MIGRATION_GUIDE.md` for step-by-step migration instructions.

## Customization

- **Branding**: Update logos in `assets/images/`
- **Colors**: Modify CSS variables in the `<style>` section
- **Content**: Edit HTML files directly
- **Features**: Add JavaScript functions in `js/app.js`

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Security Notes

- Change default admin credentials after first login
- Database backend provides secure server-side data storage
- Implement proper JWT authentication for production use
- Use HTTPS for all production deployments
- Regular database backups are automatically handled by Cloudflare D1
- Input validation and SQL injection protection built into schema

## Support

This is a comprehensive driving school management system with both frontend interface and database backend. The system includes:

- **Complete Database Schema**: Ready for production use
- **API Examples**: Cloudflare Workers integration
- **Migration Tools**: Move from localStorage to D1
- **Setup Guides**: Step-by-step deployment instructions

All sample data has been removed and the system is ready for production deployment with Cloudflare D1 database backend.