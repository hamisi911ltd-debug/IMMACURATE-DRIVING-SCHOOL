# Cloudflare Deployment Guide - React + D1 Database

Complete guide to deploy your Immacurate DSMS React application to Cloudflare Pages with D1 Database.

## 📋 Prerequisites

1. **Cloudflare Account** - Sign up at https://dash.cloudflare.com
2. **Node.js** - Version 18 or higher
3. **Wrangler CLI** - Cloudflare's command-line tool

## 🚀 Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

Login to Cloudflare:
```bash
wrangler login
```

## 📦 Step 2: Install Dependencies

Install React frontend dependencies:
```bash
npm install
```

## 🗄️ Step 3: Create D1 Database

Create your D1 database:
```bash
npm run db:create
```

This will output a database ID. Copy it and update `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "immacurate-dsms-db"
database_id = "YOUR_DATABASE_ID_HERE"  # Replace with your actual ID
```

## 🔧 Step 4: Initialize Database Schema

Run the schema creation:
```bash
npm run db:init
```

Seed the database with initial data:
```bash
npm run db:seed
```

## 🏗️ Step 5: Build React Application

Build the production React app:
```bash
npm run build
```

This creates a `dist` folder with your compiled React application.

## 🌐 Step 6: Deploy to Cloudflare Pages

### Option A: Deploy via Wrangler CLI

```bash
npm run deploy
```

Or manually:
```bash
wrangler pages deploy dist --project-name=immacurate-dsms
```

### Option B: Deploy via Cloudflare Dashboard

1. Go to https://dash.cloudflare.com
2. Navigate to **Pages**
3. Click **Create a project**
4. Connect your GitHub repository
5. Configure build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Add environment variable:
   - `NODE_VERSION`: `18`
7. Click **Save and Deploy**

## 🔗 Step 7: Bind D1 Database to Pages

In Cloudflare Dashboard:

1. Go to your Pages project
2. Click **Settings** → **Functions**
3. Scroll to **D1 database bindings**
4. Click **Add binding**
5. Set:
   - **Variable name**: `DB`
   - **D1 database**: Select `immacurate-dsms-db`
6. Click **Save**

## 🔐 Step 8: Create Admin User

Create your first admin user in the database:

```bash
wrangler d1 execute immacurate-dsms-db --command="
INSERT INTO system_users (
  user_id, first_name, last_name, email, password_hash, role, status
) VALUES (
  'admin-001',
  'Admin',
  'User',
  'admin@immacurate.com',
  'YWRtaW4xMjM=',
  'admin',
  'active'
)"
```

**Default Login Credentials:**
- Email: `admin@immacurate.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change this password immediately after first login!

## ✅ Step 9: Verify Deployment

Your application should now be live at:
```
https://immacurate-dsms.pages.dev
```

Test the following:
1. ✅ Login page loads
2. ✅ Can login with admin credentials
3. ✅ Dashboard displays
4. ✅ Can view students list
5. ✅ API endpoints respond correctly

## 🔍 Step 10: Test API Endpoints

Test your API:

```bash
# Health check
curl https://immacurate-dsms.pages.dev/api/health

# Login
curl -X POST https://immacurate-dsms.pages.dev/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@immacurate.com","password":"admin123"}'
```

## 📊 Database Management

### View Database Tables
```bash
wrangler d1 execute immacurate-dsms-db --command="SELECT name FROM sqlite_master WHERE type='table'"
```

### Query Students
```bash
wrangler d1 execute immacurate-dsms-db --command="SELECT * FROM students LIMIT 5"
```

### Backup Database
```bash
wrangler d1 export immacurate-dsms-db --output=backup.sql
```

### Restore Database
```bash
wrangler d1 execute immacurate-dsms-db --file=backup.sql
```

## 🔄 Continuous Deployment

### Automatic Deployment from GitHub

1. Push your code to GitHub
2. In Cloudflare Pages, connect your repository
3. Every push to `main` branch will auto-deploy

### Manual Deployment

```bash
# Build and deploy
npm run build
npm run cf:deploy
```

## 🛠️ Development Workflow

### Local Development

1. Start Vite dev server:
```bash
npm run dev
```

2. In another terminal, start Cloudflare Pages dev server:
```bash
npm run cf:dev
```

This runs your Functions locally with D1 database access.

### Environment Variables

Create `.env` file:
```env
VITE_API_URL=/api
VITE_APP_NAME=Immacurate DSMS
VITE_APP_VERSION=1.0.0
```

## 📁 Project Structure

```
immacurate-dsms/
├── src/                    # React source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── store/             # State management
├── functions/             # Cloudflare Workers Functions
│   ├── api/              # API endpoints
│   │   ├── auth/         # Authentication
│   │   ├── students/     # Student management
│   │   ├── courses/      # Course management
│   │   └── ...
│   └── _middleware.js    # Global middleware
├── database/             # Database files
│   ├── schema.sql        # Database schema
│   └── seed_data.sql     # Initial data
├── dist/                 # Build output (generated)
├── wrangler.toml         # Cloudflare configuration
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies

```

## 🔒 Security Best Practices

1. **Change Default Password** - Immediately after deployment
2. **Use Environment Variables** - For sensitive data
3. **Enable HTTPS** - Cloudflare provides this automatically
4. **Implement Rate Limiting** - Protect your API
5. **Regular Backups** - Export your D1 database regularly

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Database Connection Issues
```bash
# Verify D1 binding
wrangler pages deployment list
```

### API Returns 500 Error
```bash
# Check function logs
wrangler pages deployment tail
```

### CORS Errors
- Ensure `_middleware.js` is in the `functions` directory
- Check CORS headers are properly set

## 📈 Monitoring

### View Logs
```bash
wrangler pages deployment tail
```

### Analytics
- Go to Cloudflare Dashboard → Pages → Your Project → Analytics

## 🎯 Next Steps

1. ✅ Deploy application
2. ✅ Create admin user
3. ✅ Test all features
4. 📝 Add more students and courses
5. 🎨 Customize branding
6. 📧 Set up email notifications (future feature)
7. 💳 Integrate payment gateway (future feature)

## 📞 Support

- **Cloudflare Docs**: https://developers.cloudflare.com/pages
- **D1 Database Docs**: https://developers.cloudflare.com/d1
- **Wrangler Docs**: https://developers.cloudflare.com/workers/wrangler

## 🎉 Success!

Your Immacurate DSMS is now live on Cloudflare Pages with D1 Database!

Access your application at: `https://your-project.pages.dev`
