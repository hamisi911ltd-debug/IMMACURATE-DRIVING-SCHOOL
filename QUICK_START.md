# Quick Start Guide - DSMS Deployment

## 🚀 Deploy in 3 Commands

### For Windows Users:

```bash
# 1. Install Wrangler (one-time setup)
npm install -g wrangler

# 2. Run deployment script
deploy.bat

# 3. Follow the prompts!
```

### For Mac/Linux Users:

```bash
# 1. Install Wrangler (one-time setup)
npm install -g wrangler

# 2. Make script executable
chmod +x deploy.sh

# 3. Run deployment script
./deploy.sh
```

---

## 📋 What Gets Deployed

### Database (Cloudflare D1)
- ✅ 13 database tables
- ✅ Default admin user
- ✅ 7 driving courses
- ✅ 3 sample instructors
- ✅ 3 sample vehicles
- ✅ System settings

### Application (Cloudflare Pages)
- ✅ Complete web interface
- ✅ Admin dashboard
- ✅ Student portal
- ✅ All management features
- ✅ Global CDN
- ✅ Automatic SSL

---

## 🔐 Default Login

```
Email: hamisi.911.ltd@gmail.com
Password: 911Hamisi.
```

**⚠️ IMPORTANT: Change this password immediately after first login!**

---

## 📊 Seed Data Included

### Admin User
- **Email**: hamisi.911.ltd@gmail.com
- **Role**: System Administrator
- **Status**: Active

### Courses (7 Total)
1. **Class A** - Light Vehicle (KES 9,200)
2. **Class B** - Medium Vehicle (KES 14,300)
3. **Class C** - Heavy Vehicle (KES 15,300)
4. **Class B Half** - Refresher (KES 10,400)
5. **Class D** - Motorcycle (KES 10,600)
6. **Class C Half** - Heavy Refresher (KES 10,600)
7. **Class CE** - Commercial Enhanced (KES 36,600)

### Instructors (3 Total)
1. **Peter Otieno** - Classes A, B, B½
2. **Sarah Njeri** - Classes A, B, C
3. **John Kamau** - Classes C, C½, CE

### Vehicles (3 Total)
1. **KBZ 123A** - Toyota Vitz (Manual)
2. **KCF 456B** - Honda Fit (Automatic)
3. **KDE 789C** - Nissan Note (Manual)

---

## 🛠️ Manual Deployment (Alternative)

If you prefer manual setup:

### Step 1: Create Database
```bash
wrangler d1 create dsms-database
```

### Step 2: Setup Schema & Data
```bash
wrangler d1 execute dsms-database --file=database/quick_setup.sql
```

### Step 3: Deploy to Pages
```bash
wrangler pages deploy . --project-name=dsms-driving-school
```

---

## ✅ Verify Deployment

### Check Database
```bash
# List all tables
wrangler d1 execute dsms-database --command="SELECT name FROM sqlite_master WHERE type='table';"

# Check admin user
wrangler d1 execute dsms-database --command="SELECT * FROM system_users;"

# Check courses
wrangler d1 execute dsms-database --command="SELECT name, total_fee FROM courses;"
```

### Access Your Site
Your site will be available at:
```
https://dsms-driving-school.pages.dev
```

---

## 🔧 Common Commands

### View Data
```bash
# All students
wrangler d1 execute dsms-database --command="SELECT * FROM students;"

# All payments
wrangler d1 execute dsms-database --command="SELECT * FROM payments;"

# All lessons
wrangler d1 execute dsms-database --command="SELECT * FROM lessons;"
```

### Add Data
```bash
# Add a student
wrangler d1 execute dsms-database --command="INSERT INTO students (student_id, first_name, last_name, email, phone, created_by) VALUES ('student-001', 'John', 'Doe', 'john@example.com', '+254700000001', 'admin-001');"
```

### Backup Database
```bash
wrangler d1 export dsms-database --output=backup.sql
```

---

## 📱 What You Can Do Now

After deployment, you can:

1. **Login** to the admin dashboard
2. **Register students** with their information
3. **Schedule lessons** with instructors and vehicles
4. **Record payments** and generate receipts
5. **Send messages** to students
6. **Generate reports** on school performance
7. **Manage courses** and pricing
8. **Track student progress**

---

## 🆘 Troubleshooting

### "Wrangler not found"
```bash
npm install -g wrangler
```

### "Not authenticated"
```bash
wrangler login
```

### "Database already exists"
- This is fine! The script will ask if you want to use it
- Choose 'y' to continue with existing database

### "Tables already exist"
- This means setup was successful
- Tables won't be duplicated

### "Cannot access site"
- Wait 2-3 minutes for deployment to complete
- Check Cloudflare dashboard for deployment status
- Try accessing the URL again

---

## 📚 Full Documentation

For detailed information, see:
- **DEPLOYMENT_STEPS.md** - Complete step-by-step guide
- **database/CLOUDFLARE_D1_SETUP.md** - Database setup details
- **database/MIGRATION_GUIDE.md** - Migrate from localStorage
- **README.md** - Project overview

---

## 💰 Cost

### Free Tier Limits (More than enough!)
- **D1 Database**: 25M reads/day, 100K writes/day, 5GB storage
- **Pages**: Unlimited static requests
- **Workers**: 100K requests/day

**Your driving school will stay FREE!**

---

## 🎉 Success!

Once deployed, you have:
- ✅ Professional driving school management system
- ✅ Secure database backend
- ✅ Global CDN distribution
- ✅ Automatic SSL/HTTPS
- ✅ Ready for production use

**Start managing your driving school today!**

---

## 📞 Support

Need help? Check:
1. **DEPLOYMENT_STEPS.md** for detailed instructions
2. **Cloudflare Docs**: https://developers.cloudflare.com
3. **GitHub Issues**: Report problems in your repository

---

**Happy Deploying! 🚗💨**