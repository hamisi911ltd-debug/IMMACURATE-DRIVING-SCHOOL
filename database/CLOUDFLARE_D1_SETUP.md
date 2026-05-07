# Cloudflare D1 Database Setup Guide

## Overview

This guide will help you set up a Cloudflare D1 database for your Driving School Management System, replacing the current localStorage system with a proper SQL database.

## What is Cloudflare D1?

Cloudflare D1 is a serverless SQL database built on SQLite, designed to run at the edge. It's perfect for your driving school application because:

- **Serverless**: No server management required
- **Global**: Runs close to your users worldwide
- **SQL**: Full SQL support with SQLite compatibility
- **Cost-effective**: Generous free tier
- **Fast**: Sub-millisecond query times

## Prerequisites

1. Cloudflare account
2. Wrangler CLI installed
3. Your DSMS project files

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

## Step 3: Create D1 Database

```bash
# Create the database
wrangler d1 create dsms-database

# This will output something like:
# [[d1_databases]]
# binding = "DB"
# database_name = "dsms-database"
# database_id = "your-database-id-here"
```

## Step 4: Configure wrangler.toml

Create a `wrangler.toml` file in your project root:

```toml
name = "dsms-app"
main = "src/index.js"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "dsms-database"
database_id = "your-database-id-here"  # Replace with your actual database ID

[vars]
ENVIRONMENT = "production"
```

## Step 5: Initialize Database Schema

```bash
# Apply the schema
wrangler d1 execute dsms-database --file=./database/schema.sql

# Seed initial data
wrangler d1 execute dsms-database --file=./database/seed_data.sql
```

## Step 6: Test Database Connection

```bash
# Open D1 console
wrangler d1 execute dsms-database --command="SELECT * FROM system_users;"
```

## Database Schema Overview

### Core Tables

1. **system_users** - Admin, manager, instructor accounts
2. **students** - Student information and profiles
3. **courses** - Available driving courses
4. **student_enrollments** - Student course registrations
5. **instructors** - Instructor profiles and specializations
6. **vehicles** - School vehicle fleet
7. **lessons** - Scheduled and completed lessons
8. **payments** - Payment records and receipts
9. **student_balances** - Current student balances
10. **messages** - Internal messaging system
11. **course_materials** - Course documents and videos
12. **student_progress** - Learning progress tracking
13. **system_settings** - Application configuration
14. **audit_log** - System activity logging

### Key Features

- **Foreign Key Constraints**: Ensures data integrity
- **Automatic Timestamps**: Created/updated timestamps
- **Triggers**: Auto-update balances and progress
- **Indexes**: Optimized for common queries
- **Views**: Pre-built queries for dashboards
- **Generated Columns**: Calculated fields (balance_due, full_name)

## Step 7: Update Your Application Code

You'll need to modify your JavaScript to use D1 instead of localStorage. Here's the basic pattern:

### Before (localStorage):
```javascript
const students = JSON.parse(localStorage.getItem('students') || '[]');
```

### After (D1):
```javascript
const students = await env.DB.prepare("SELECT * FROM students WHERE status = 'active'").all();
```

## Common D1 Operations

### Insert Student
```sql
INSERT INTO students (student_id, first_name, last_name, email, phone, created_by) 
VALUES (?, ?, ?, ?, ?, ?);
```

### Get Student Dashboard
```sql
SELECT * FROM student_dashboard WHERE student_id = ?;
```

### Record Payment
```sql
INSERT INTO payments (payment_id, receipt_number, student_id, amount, payment_method, processed_by) 
VALUES (?, ?, ?, ?, ?, ?);
```

### Get Instructor Schedule
```sql
SELECT * FROM instructor_schedule 
WHERE instructor_name = ? AND scheduled_date = DATE('now');
```

## Step 8: Deploy to Cloudflare Workers/Pages

### For Cloudflare Workers:
```bash
wrangler deploy
```

### For Cloudflare Pages:
1. Go to Cloudflare Dashboard → Pages
2. Connect your GitHub repository
3. Add D1 database binding in Pages settings
4. Deploy

## Environment Variables

Set these in your Cloudflare dashboard:

```
DB_NAME=dsms-database
ENVIRONMENT=production
JWT_SECRET=your-jwt-secret-here
ADMIN_EMAIL=hamisi.911.ltd@gmail.com
```

## Security Considerations

1. **Password Hashing**: Use bcrypt for password storage
2. **JWT Tokens**: Implement proper authentication
3. **Input Validation**: Sanitize all user inputs
4. **SQL Injection**: Use prepared statements (already implemented)
5. **Rate Limiting**: Implement API rate limiting

## Backup Strategy

```bash
# Export database backup
wrangler d1 export dsms-database --output=backup.sql

# Restore from backup
wrangler d1 execute dsms-database --file=backup.sql
```

## Monitoring and Analytics

1. **Cloudflare Analytics**: Built-in request analytics
2. **D1 Metrics**: Query performance and usage
3. **Error Tracking**: Monitor application errors
4. **Custom Logging**: Implement application-specific logs

## Cost Estimation

### D1 Free Tier:
- **Reads**: 25 million per day
- **Writes**: 100,000 per day  
- **Storage**: 5 GB
- **Databases**: 10 databases

### Typical Usage (Small Driving School):
- **Daily Reads**: ~1,000 (well within limits)
- **Daily Writes**: ~100 (well within limits)
- **Storage**: ~100 MB (well within limits)

**Result**: Your driving school will likely stay within the free tier!

## Migration from localStorage

To migrate existing localStorage data:

1. Export current data from browser
2. Transform to SQL INSERT statements
3. Execute via wrangler CLI
4. Update application code
5. Test thoroughly
6. Deploy new version

## Troubleshooting

### Common Issues:

1. **Database ID mismatch**: Check wrangler.toml
2. **Schema errors**: Verify SQL syntax
3. **Permission errors**: Check Cloudflare API tokens
4. **Connection timeouts**: Check network connectivity

### Debug Commands:

```bash
# Check database info
wrangler d1 info dsms-database

# List all databases
wrangler d1 list

# Execute custom query
wrangler d1 execute dsms-database --command="PRAGMA table_info(students);"
```

## Next Steps

1. Set up the database using this guide
2. Modify your application code to use D1
3. Test all functionality thoroughly
4. Deploy to production
5. Monitor performance and usage
6. Set up regular backups

Your Driving School Management System will now have a robust, scalable database backend powered by Cloudflare D1!

## Support Resources

- **Cloudflare D1 Docs**: [developers.cloudflare.com/d1](https://developers.cloudflare.com/d1)
- **Wrangler CLI Docs**: [developers.cloudflare.com/workers/wrangler](https://developers.cloudflare.com/workers/wrangler)
- **SQLite Documentation**: [sqlite.org/docs.html](https://sqlite.org/docs.html)