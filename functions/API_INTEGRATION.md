# API Integration Guide

## Available API Endpoints

Your Cloudflare Pages Functions are now deployed and ready to use!

### Authentication

#### Login
```javascript
POST /api/auth/login

// Request
{
  "email": "hamisi.911.ltd@gmail.com",
  "password": "911Hamisi."
}

// Response
{
  "success": true,
  "user": {
    "user_id": "admin-001",
    "name": "System Administrator",
    "email": "hamisi.911.ltd@gmail.com",
    "role": "system-admin"
  }
}
```

### Students

#### List Students
```javascript
GET /api/students/list

// Response
{
  "success": true,
  "students": [...],
  "count": 10
}
```

#### Register Student
```javascript
POST /api/students/register

// Request
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+254700000001",
  "course": "class-b"  // optional
}

// Response
{
  "success": true,
  "message": "Student registered successfully",
  "studentId": "student-xxx"
}
```

### Courses

#### List Courses
```javascript
GET /api/courses/list

// Response
{
  "success": true,
  "courses": [...],
  "count": 7
}
```

### Lessons

#### List Today's Lessons
```javascript
GET /api/lessons/list

// Response
{
  "success": true,
  "lessons": [...],
  "count": 5
}
```

#### Schedule Lesson
```javascript
POST /api/lessons/schedule

// Request
{
  "student": "student-xxx",
  "instructor": "inst-001",
  "vehicle": "veh-001",
  "date": "2024-05-15",
  "time": "10:00",
  "lessonType": "practical",
  "duration": 60
}

// Response
{
  "success": true,
  "message": "Lesson scheduled successfully",
  "lessonId": "lesson-xxx"
}
```

### Payments

#### Record Payment
```javascript
POST /api/payments/record

// Request
{
  "student": "student-xxx",
  "amount": 5000.00,
  "method": "mpesa",
  "paymentType": "tuition",
  "reference": "ABC123"
}

// Response
{
  "success": true,
  "message": "Payment recorded successfully",
  "paymentId": "payment-xxx",
  "receiptNumber": "001"
}
```

### Dashboard

#### Get Dashboard Stats
```javascript
GET /api/dashboard/stats

// Response
{
  "success": true,
  "stats": {
    "totalStudents": 10,
    "activeCourses": 7,
    "monthlyRevenue": 50000,
    "pendingPayments": 3,
    "recentEnrollments": [...],
    "todaysLessons": [...]
  }
}
```

## Frontend Integration Examples

### Using Fetch API

```javascript
// Register a student
async function registerStudent(studentData) {
  try {
    const response = await fetch('/api/students/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(studentData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Student registered successfully!');
      // Reload student list
      loadStudents();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to register student');
  }
}

// Load students
async function loadStudents() {
  try {
    const response = await fetch('/api/students/list');
    const result = await response.json();
    
    if (result.success) {
      displayStudents(result.students);
    }
  } catch (error) {
    console.error('Error loading students:', error);
  }
}

// Record payment
async function recordPayment(paymentData) {
  try {
    const response = await fetch('/api/payments/record', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert(`Payment recorded! Receipt #${result.receiptNumber}`);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Load dashboard stats
async function loadDashboard() {
  try {
    const response = await fetch('/api/dashboard/stats');
    const result = await response.json();
    
    if (result.success) {
      updateDashboard(result.stats);
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}
```

## Testing Your APIs

### Using Browser Console

```javascript
// Test student registration
fetch('/api/students/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'Test',
    lastName: 'Student',
    email: 'test@example.com',
    phone: '+254700000001',
    course: 'class-b'
  })
}).then(r => r.json()).then(console.log);

// Test student list
fetch('/api/students/list')
  .then(r => r.json())
  .then(console.log);

// Test dashboard stats
fetch('/api/dashboard/stats')
  .then(r => r.json())
  .then(console.log);
```

### Using cURL

```bash
# Register student
curl -X POST https://your-site.pages.dev/api/students/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe","email":"john@example.com","phone":"+254700000001","course":"class-b"}'

# List students
curl https://your-site.pages.dev/api/students/list

# Get dashboard stats
curl https://your-site.pages.dev/api/dashboard/stats
```

## Error Handling

All endpoints return consistent error responses:

```javascript
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (missing/invalid data)
- `401` - Unauthorized (authentication failed)
- `500` - Server Error

## CORS

All endpoints include CORS headers:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

## Next Steps

1. **Deploy** - Push to GitHub, Cloudflare Pages will auto-deploy
2. **Test** - Use browser console to test endpoints
3. **Integrate** - Update your frontend forms to use these APIs
4. **Monitor** - Check Cloudflare dashboard for logs and errors

Your APIs are now live and connected to your D1 database!