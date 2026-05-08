# Troubleshooting Guide - Common Issues & Solutions

## Issues Fixed

### ✅ Issue 1: UNIQUE Constraint Failed (students.phone)
**Error:** `D1_ERROR: UNIQUE constraint failed: students.phone: SQLITE_CONSTRAINT`

**Cause:** Trying to register a student with an email or phone number that already exists in the database.

**Solution Implemented:**
- Added duplicate checking before insert
- Check if email exists
- Check if phone exists
- Return user-friendly error message

**How it works now:**
```javascript
// Before insert, check for duplicates
const existingEmail = await DB.prepare(
  'SELECT student_id FROM students WHERE email = ?'
).bind(email).first();

if (existingEmail) {
  return { error: 'A student with this email already exists' };
}
```

**User Experience:**
- Clear error message: "A student with this email already exists"
- Or: "A student with this phone number already exists"
- No cryptic database errors

---

### ✅ Issue 2: Student Not Found
**Error:** `Student not found: student-1778218351129-gx9b2i5jr`

**Cause:** Trying to view a student that doesn't exist or was deleted.

**Solution Implemented:**
- Better error handling in viewStudent function
- Check if API returns success before displaying
- Show user-friendly error message
- Enhanced modal with detailed student information

**How it works now:**
```javascript
if (result.success) {
  // Show student details in modal
} else {
  alert('Error: ' + (result.error || 'Student not found'));
}
```

**User Experience:**
- Clear error message if student not found
- Beautiful modal with student details if found
- Shows payments and lessons history
- Edit button for future functionality

---

## Common Issues & Solutions

### Issue: Duplicate Student Registration

**Symptoms:**
- Error: "UNIQUE constraint failed"
- Student registration fails
- Database error message

**Solutions:**

1. **Check if student already exists:**
```bash
wrangler d1 execute dsms-database --command="SELECT * FROM students WHERE email = 'student@example.com';"
```

2. **Delete duplicate if needed:**
```bash
wrangler d1 execute dsms-database --command="DELETE FROM students WHERE email = 'student@example.com';"
```

3. **Use different email/phone:**
- Try registering with a different email
- Try registering with a different phone number

---

### Issue: Student Not Found

**Symptoms:**
- "Student not found" error
- Can't view student details
- Student ID doesn't exist

**Solutions:**

1. **Verify student exists:**
```bash
wrangler d1 execute dsms-database --command="SELECT * FROM students WHERE student_id = 'student-xxx';"
```

2. **List all students:**
```bash
wrangler d1 execute dsms-database --command="SELECT student_id, first_name, last_name, email FROM students;"
```

3. **Check student status:**
```bash
wrangler d1 execute dsms-database --command="SELECT * FROM students WHERE status = 'active';"
```

4. **If student was deleted, re-register:**
- Use the "Add Student" button
- Fill in student details
- Submit registration

---

### Issue: API Returns 404

**Symptoms:**
- "404 Not Found" error
- API endpoint doesn't work
- Functions not deployed

**Solutions:**

1. **Check deployment status:**
- Go to Cloudflare Dashboard → Pages
- Check if deployment completed
- Look for "Deployment successful"

2. **Wait for deployment:**
- Deployments take 2-3 minutes
- Refresh after deployment completes

3. **Verify functions deployed:**
```bash
# Check if functions directory exists
ls functions/api/students/
```

4. **Test API directly:**
```bash
curl https://your-site.pages.dev/api/health
```

---

### Issue: API Returns 500

**Symptoms:**
- "500 Internal Server Error"
- Database connection error
- Server error

**Solutions:**

1. **Check database binding:**
- Cloudflare Dashboard → Pages → Settings → Functions
- Verify D1 binding exists:
  - Variable name: `DB`
  - Database: `dsms-database`

2. **Check database exists:**
```bash
wrangler d1 list
```

3. **Verify database has tables:**
```bash
wrangler d1 execute dsms-database --command="SELECT name FROM sqlite_master WHERE type='table';"
```

4. **Re-apply schema if needed:**
```bash
wrangler d1 execute dsms-database --file=database/quick_setup.sql
```

---

### Issue: Data Not Saving

**Symptoms:**
- Form submits successfully
- But data doesn't appear in list
- Database query shows no data

**Solutions:**

1. **Check browser console:**
- Press F12
- Look for errors in Console tab
- Check Network tab for failed requests

2. **Verify API response:**
```javascript
// In browser console
fetch('/api/students/list')
  .then(r => r.json())
  .then(console.log);
```

3. **Check database directly:**
```bash
wrangler d1 execute dsms-database --command="SELECT COUNT(*) as total FROM students;"
```

4. **Test API with curl:**
```bash
curl -X POST https://your-site.pages.dev/api/students/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Test","lastName":"User","email":"test@example.com","phone":"+254700000001"}'
```

---

### Issue: CORS Error

**Symptoms:**
- "CORS policy" error in console
- API calls blocked by browser
- Cross-origin request failed

**Solutions:**

1. **Check middleware:**
- Verify `functions/_middleware.js` exists
- Check CORS headers are set

2. **Clear browser cache:**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear cache and reload

3. **Check API response headers:**
```bash
curl -I https://your-site.pages.dev/api/health
```

Should include:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
```

---

### Issue: Validation Error

**Symptoms:**
- "Missing required fields" error
- "Invalid email" error
- Form validation fails

**Solutions:**

1. **Check required fields:**
- First Name (required, min 2 characters)
- Last Name (required, min 2 characters)
- Email (required, valid email format)
- Phone (required, valid phone format)

2. **Valid email format:**
```
✅ john@example.com
✅ student.name@school.edu
❌ john@
❌ @example.com
❌ john.example.com
```

3. **Valid phone format:**
```
✅ +254700000001
✅ 0700000001
✅ +1-555-123-4567
❌ abc123
❌ 123 (too short)
```

4. **Check validation rules:**
```javascript
// In backend/app.js
validate(body, {
  firstName: { required: true, min: 2 },
  lastName: { required: true, min: 2 },
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'phone' }
})
```

---

### Issue: Database Connection Error

**Symptoms:**
- "Database not found" error
- "Cannot read property 'DB'" error
- Database binding error

**Solutions:**

1. **Verify database exists:**
```bash
wrangler d1 list
```

2. **Check database ID:**
```bash
wrangler d1 info dsms-database
```

3. **Update wrangler.toml:**
```toml
[[d1_databases]]
binding = "DB"
database_name = "dsms-database"
database_id = "your-database-id-here"
```

4. **Bind database to Pages:**
- Cloudflare Dashboard → Pages → Settings → Functions
- Add D1 Database Binding
- Variable name: `DB`
- D1 database: `dsms-database`

---

### Issue: Old Data Showing

**Symptoms:**
- Changes not reflected
- Old student data appears
- Updates don't show

**Solutions:**

1. **Hard refresh browser:**
- Windows: Ctrl+Shift+R
- Mac: Cmd+Shift+R

2. **Clear browser cache:**
- Chrome: Settings → Privacy → Clear browsing data
- Firefox: Settings → Privacy → Clear Data

3. **Check if data actually updated:**
```bash
wrangler d1 execute dsms-database --command="SELECT * FROM students ORDER BY created_at DESC LIMIT 5;"
```

4. **Reload page data:**
- Click on different navigation section
- Click back to original section
- Data should refresh

---

## Debugging Commands

### Check Database

```bash
# List all tables
wrangler d1 execute dsms-database --command="SELECT name FROM sqlite_master WHERE type='table';"

# Count students
wrangler d1 execute dsms-database --command="SELECT COUNT(*) as total FROM students;"

# View recent students
wrangler d1 execute dsms-database --command="SELECT * FROM students ORDER BY created_at DESC LIMIT 5;"

# Check for duplicates
wrangler d1 execute dsms-database --command="SELECT email, COUNT(*) as count FROM students GROUP BY email HAVING count > 1;"

# View student by ID
wrangler d1 execute dsms-database --command="SELECT * FROM students WHERE student_id = 'student-xxx';"
```

### Test APIs

```bash
# Health check
curl https://your-site.pages.dev/api/health

# List students
curl https://your-site.pages.dev/api/students/list

# View single student
curl https://your-site.pages.dev/api/students/student-xxx

# Register student
curl -X POST https://your-site.pages.dev/api/students/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","phone":"+254700000001"}'
```

### Check Logs

```bash
# View real-time logs
wrangler tail

# View Pages logs
# Go to: Cloudflare Dashboard → Pages → Your Project → Functions → Logs
```

### Browser Console

```javascript
// Test API in browser console (F12)

// List students
fetch('/api/students/list').then(r => r.json()).then(console.log);

// Register student
fetch('/api/students/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@example.com',
    phone: '+254700000001'
  })
}).then(r => r.json()).then(console.log);

// View student
fetch('/api/students/student-xxx').then(r => r.json()).then(console.log);
```

---

## Prevention Tips

### 1. Avoid Duplicate Registrations
- Check if student exists before registering
- Use unique emails for each student
- Use unique phone numbers for each student

### 2. Verify Data Before Submission
- Double-check email format
- Verify phone number format
- Ensure all required fields filled

### 3. Regular Database Checks
```bash
# Weekly check
wrangler d1 execute dsms-database --command="SELECT COUNT(*) FROM students;"
wrangler d1 execute dsms-database --command="SELECT COUNT(*) FROM payments;"
```

### 4. Monitor Errors
- Check browser console regularly
- Review Cloudflare logs
- Test APIs after deployment

### 5. Backup Database
```bash
# Export database
wrangler d1 export dsms-database --output=backup-$(date +%Y%m%d).sql

# Import if needed
wrangler d1 execute dsms-database --file=backup-20240101.sql
```

---

## Getting Help

### 1. Check Documentation
- `README.md` - Project overview
- `COMPLETE_FUNCTIONALITY_GUIDE.md` - Feature guide
- `BACKEND_DEPLOYMENT.md` - Backend guide
- `API_INTEGRATION_COMPLETE.md` - API guide

### 2. Test Page
Visit: `https://your-site.pages.dev/test-api.html`
- Test all API endpoints
- See request/response data
- Identify failing endpoints

### 3. Browser DevTools
- Press F12
- Console tab: See errors
- Network tab: See API calls
- Application tab: See localStorage

### 4. Cloudflare Dashboard
- Pages → Your Project → Deployments
- Pages → Your Project → Functions → Logs
- D1 → Your Database → Metrics

---

## Summary

**Fixed Issues:**
- ✅ UNIQUE constraint error (duplicate email/phone)
- ✅ Student not found error (better error handling)
- ✅ Enhanced student view modal
- ✅ Better error messages

**Prevention:**
- Check for duplicates before insert
- Validate input before submission
- Handle errors gracefully
- Show user-friendly messages

**Your DSMS now has robust error handling!** 🛡️
