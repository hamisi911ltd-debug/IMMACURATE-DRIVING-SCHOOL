# Complete Deployment Guide for DSMS

## Step-by-Step Instructions to Deploy Your Driving School Management System

### Prerequisites
- Cloudflare account (free tier is fine)
- Git installed on your computer
- Node.js installed (for Wrangler CLI)

---

## PART 1: Setup Cloudflare D1 Database

### Step 1: Install Wrangler CLI

Open your terminal and run:

```bash
npm install -g wrangler
```

### Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

### Step 3: Create D1 Database

```bash
wrangler d1 create dsms-database
```

**IMPORTANT**: Copy the output! It will look like this:

```toml
[[d1_databases]]
binding = "DB"
database_name = "dsms-database"
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

Save the `database_id` - you'll need it!

### Step 4: Create Tables and Insert Seed Data

Run this single command to set up everything:

```bash
wrangler d1 execute dsms-database --file=./database/quick_setup.sql
```

This will:
- Create all 13 database tables
- Insert default admin user (hamisi.911.ltd@gmail.com)
- Insert 7 driving courses
- Insert 3 sample instructors
- Insert 3 sample vehicles
- Insert system settings
- Create all necessary indexes

### Step 5: Verify Database Setup

Check if everything was created:

```bash
wrangler d1 execute dsms-database --command="SELECT name FROM sqlite_master WHERE type='table';"
```

You should see all your tables listed.

Check the admin user:

```bash
wrangler d1 execute dsms-database --command="SELECT * FROM system_users;"
```

Check the courses:

```bash
wrangler d1 execute dsms-database --command="SELECT course_id, name, total_fee FROM courses;"
```

---

## PART 2: Deploy to Cloudflare Pages

### Option A: Deploy via Cloudflare Dashboard (Easiest)

1. **Go to Cloudflare Dashboard**
   - Visit: https://dash.cloudflare.com
   - Click "Pages" in the left sidebar

2. **Create New Project**
   - Click "Create a project"
   - Click "Connect to Git"

3. **Connect GitHub Repository**
   - Select your GitHub account
   - Choose repository: `IMMACURATE-DRIVING-SCHOOL`
   - Click "Begin setup"

4. **Configure Build Settings**
   ```
   Project name: dsms-driving-school
   Production branch: main
   Framework preset: None
   Build command: (leave empty)
   Build output directory: /
   Root directory: (leave empty)
   ```

5. **Add Environment Variables**
   - Scroll down to "Environment variables"
   - Click "Add variable"
   - Add these:
     ```
     DATABASE_ID = your-database-id-from-step-3
     ENVIRONMENT = production
     ```

6. **Deploy**
   - Click "Save and Deploy"
   - Wait 1-2 minutes for deployment
   - Your site will be live at: `https://dsms-driving-school.pages.dev`

### Option B: Deploy via Wrangler CLI

1. **Create wrangler.toml file**

Create a file named `wrangler.toml` in your project root:

```toml
name = "dsms-app"
compatibility_date = "2024-01-01"
pages_build_output_dir = "."

[[d1_databases]]
binding = "DB"
database_name = "dsms-database"
database_id = "your-database-id-here"  # Replace with your actual ID

[vars]
ENVIRONMENT = "production"
```

2. **Deploy**

```bash
wrangler pages deploy . --project-name=dsms-driving-school
```

---

## PART 3: Connect Database to Your Application

### For Static Site (Current Setup)

Your current application uses localStorage. To connect to D1, you need to:

1. **Create API Worker** (see `database/api_examples.js`)
2. **Update Frontend** to call API instead of localStorage
3. **Deploy Worker** alongside Pages

### Quick Test Without API (Browser Console)

For now, you can test the database directly:

```bash
# Get all students
wrangler d1 execute dsms-database --command="SELECT * FROM students;"

# Add a test student
wrangler d1 execute dsms-database --command="INSERT INTO students (student_id, first_name, last_name, email, phone, created_by) VALUES ('student-001', 'Test', 'Student', 'test@example.com', '+254700000001', 'admin-001');"

# Check the student was added
wrangler d1 execute dsms-database --command="SELECT * FROM students;"
```

---

## PART 4: Access Your Application

### Your Live URLs

After deployment, you'll have:

1. **Main Application**: `https://dsms-driving-school.pages.dev`
2. **Custom Domain** (optional): `https://yourdomain.com`

### Default Login Credentials

```
Email: hamisi.911.ltd@gmail.com
Password: 911Hamisi.
```

**IMPORTANT**: Change this password after first login!

---

## PART 5: Add Custom Domain (Optional)

1. **In Cloudflare Pages Dashboard**
   - Go to your project
   - Click "Custom domains" tab
   - Click "Set up a custom domain"

2. **Enter Your Domain**
   - Type your domain (e.g., `dsms.yourdomain.com`)
   - Click "Continue"

3. **Configure DNS**
   - Cloudflare will show you DNS records to add
   - Add the CNAME record to your domain
   - Wait for DNS propagation (5-30 minutes)

4. **SSL Certificate**
   - Cloudflare automatically provisions SSL
   - Your site will be HTTPS by default

---

## PART 6: Verify Everything Works

### Checklist

- [ ] Database created successfully
- [ ] Tables and seed data inserted
- [ ] Site deployed to Cloudflare Pages
- [ ] Can access the site URL
- [ ] Can login with default credentials
- [ ] Dashboard loads correctly
- [ ] Can see the 7 courses
- [ ] All pages navigate correctly

### Test Database Queries

```bash
# Count students
wrangler d1 execute dsms-database --command="SELECT COUNT(*) as total FROM students;"

# List all courses
wrangler d1 execute dsms-database --command="SELECT name, total_fee FROM courses ORDER BY name;"

# Check system settings
wrangler d1 execute dsms-database --command="SELECT * FROM system_settings;"
```

---

## PART 7: Next Steps

### Immediate Tasks

1. **Change Admin Password**
   - Login to the system
   - Go to User Management
   - Update your password

2. **Add Real Data**
   - Add your actual instructors
   - Add your vehicles
   - Update school information in settings

3. **Test All Features**
   - Register a test student
   - Schedule a test lesson
   - Record a test payment
   - Send a test message

### Future Enhancements

1. **Connect Frontend to Database**
   - Implement API Workers (see `database/api_examples.js`)
   - Update frontend to use API calls
   - Remove localStorage dependencies

2. **Add Authentication**
   - Implement JWT tokens
   - Add password hashing (bcrypt)
   - Add session management

3. **Enable Backups**
   ```bash
   # Manual backup
   wrangler d1 export dsms-database --output=backup.sql
   
   # Schedule regular backups (add to cron)
   wrangler d1 export dsms-database --output=backup-$(date +%Y%m%d).sql
   ```

4. **Monitor Usage**
   - Check Cloudflare Analytics
   - Monitor D1 query performance
   - Track user activity

---

## Troubleshooting

### Issue: "Database not found"
**Solution**: Make sure you're using the correct database_id from Step 3

### Issue: "Tables already exist"
**Solution**: This is fine - it means tables were created successfully

### Issue: "Cannot access site"
**Solution**: 
- Check deployment status in Cloudflare dashboard
- Verify DNS settings if using custom domain
- Wait a few minutes for deployment to complete

### Issue: "Login not working"
**Solution**: 
- Current app uses localStorage, not database yet
- You need to implement API Workers to connect frontend to D1
- For now, use the existing localStorage login

### Issue: "Wrangler command not found"
**Solution**: 
```bash
npm install -g wrangler
# or
npx wrangler [command]
```

---

## Database Management Commands

### View Data
```bash
# List all tables
wrangler d1 execute dsms-database --command="SELECT name FROM sqlite_master WHERE type='table';"

# View students
wrangler d1 execute dsms-database --command="SELECT * FROM students LIMIT 10;"

# View courses
wrangler d1 execute dsms-database --command="SELECT * FROM courses;"

# View payments
wrangler d1 execute dsms-database --command="SELECT * FROM payments ORDER BY payment_date DESC LIMIT 10;"
```

### Add Data
```bash
# Add a student
wrangler d1 execute dsms-database --command="INSERT INTO students (student_id, first_name, last_name, email, phone, created_by) VALUES ('student-$(date +%s)', 'John', 'Doe', 'john@example.com', '+254700000001', 'admin-001');"

# Add a payment
wrangler d1 execute dsms-database --command="INSERT INTO payments (payment_id, receipt_number, student_id, amount, payment_method, payment_type, processed_by) VALUES ('payment-$(date +%s)', '001', 'student-001', 5000.00, 'mpesa', 'tuition', 'admin-001');"
```

### Backup & Restore
```bash
# Backup
wrangler d1 export dsms-database --output=backup-$(date +%Y%m%d).sql

# Restore
wrangler d1 execute dsms-database --file=backup-20240101.sql
```

---

## Support & Resources

- **Cloudflare D1 Docs**: https://developers.cloudflare.com/d1
- **Cloudflare Pages Docs**: https://developers.cloudflare.com/pages
- **Wrangler CLI Docs**: https://developers.cloudflare.com/workers/wrangler
- **Your Database Dashboard**: https://dash.cloudflare.com → D1

---

## Success!

Your Driving School Management System is now deployed with:
- ✅ Cloudflare D1 Database (13 tables)
- ✅ Default admin user
- ✅ 7 driving courses
- ✅ Sample instructors and vehicles
- ✅ Live website on Cloudflare Pages
- ✅ Global CDN distribution
- ✅ Automatic SSL certificate

**Your site is live and ready to use!**

Login at: `https://dsms-driving-school.pages.dev`

Email: `hamisi.911.ltd@gmail.com`
Password: `911Hamisi.`