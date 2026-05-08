# Backend Deployment Guide

## Overview

Your DSMS now has a comprehensive, production-grade backend built with Cloudflare Workers that handles all API operations with proper routing, validation, error handling, and middleware.

## Backend Architecture

### Technology Stack
- **Runtime:** Cloudflare Workers (Edge Computing)
- **Database:** Cloudflare D1 (SQLite)
- **Router:** Custom advanced router with pattern matching
- **Validation:** Built-in request validation
- **Middleware:** CORS, logging, error handling

### File Structure

```
backend/
├── index.js          # Main worker entry point
├── app.js            # Application with all routes
├── router.js         # Advanced routing system
└── middleware.js     # Global middleware

functions/
├── _middleware.js    # Cloudflare Pages middleware
└── api/              # Individual API endpoints (fallback)

wrangler.toml         # Cloudflare Workers configuration
```

## Features

### 1. Advanced Routing System
- Pattern matching with parameters (`:id`)
- Query string parsing
- Multiple HTTP methods (GET, POST, PUT, DELETE, PATCH)
- Automatic CORS handling
- 404 handling

### 2. Request Validation
- Required field validation
- Type validation (email, phone, number)
- Min/max length validation
- Custom validation rules

### 3. Error Handling
- Global error catching
- Detailed error messages
- Stack traces in development
- User-friendly error responses

### 4. Middleware
- CORS headers on all responses
- Request logging
- Authentication (ready for JWT)
- Rate limiting (can be added)

### 5. Database Operations
- Prepared statements (SQL injection protection)
- Transaction support
- Connection pooling
- Query optimization

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Students
- `GET /api/students/list` - List all students (with pagination, filters)
- `GET /api/students/:id` - Get single student
- `POST /api/students/register` - Register new student
- `PUT /api/students/:id` - Update student

### Courses
- `GET /api/courses/list` - List all courses
- `GET /api/courses/:id` - Get single course

### Lessons
- `GET /api/lessons/list` - List lessons (with filters)
- `POST /api/lessons/schedule` - Schedule new lesson

### Payments
- `GET /api/payments/list` - List payments (with filters)
- `POST /api/payments/record` - Record payment

### Messages
- `GET /api/messages/list` - List messages
- `POST /api/messages/send` - Send message
- `POST /api/messages/broadcast` - Broadcast message

### Instructors & Vehicles
- `GET /api/instructors/list` - List instructors
- `GET /api/vehicles/list` - List vehicles

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics

### Reports
- `POST /api/reports/generate` - Generate reports

### Health Check
- `GET /api/health` - Check backend status

## Deployment Options

### Option 1: Cloudflare Pages Functions (Current)
Your backend is already deployed as Cloudflare Pages Functions. No additional deployment needed.

**Pros:**
- Automatic deployment on git push
- Integrated with frontend
- No separate configuration

**Cons:**
- Limited to Pages Functions structure
- Less control over routing

### Option 2: Cloudflare Workers (Recommended)
Deploy as a standalone Cloudflare Worker for better performance and control.

**Steps:**

1. **Install Wrangler CLI:**
```bash
npm install -g wrangler
```

2. **Login to Cloudflare:**
```bash
wrangler login
```

3. **Update wrangler.toml:**
Edit `wrangler.toml` and update:
- `name` - Your worker name
- `database_id` - Your D1 database ID
- `zone_name` - Your domain (if using custom domain)

4. **Deploy:**
```bash
wrangler deploy
```

5. **Test:**
```bash
curl https://your-worker.workers.dev/api/health
```

### Option 3: Hybrid Approach (Best)
Use both:
- Cloudflare Pages for frontend
- Cloudflare Workers for backend API

**Benefits:**
- Separate concerns
- Independent scaling
- Better performance
- Custom domain for API

**Setup:**

1. Deploy frontend to Pages (already done)
2. Deploy backend to Workers:
```bash
cd backend
wrangler deploy
```

3. Update frontend API calls to use Worker URL:
```javascript
const API_BASE = 'https://api.your-domain.com';
// or
const API_BASE = 'https://dsms-backend.workers.dev';
```

## Configuration

### Environment Variables

Edit `wrangler.toml`:

```toml
[vars]
ENVIRONMENT = "production"
APP_NAME = "DSMS"
JWT_SECRET = "your-secret-key"
ALLOWED_ORIGINS = "*"
```

### Database Binding

Already configured in `wrangler.toml`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "dsms-database"
database_id = "8a093983-a79f-4006-8294-2ce7141d64d0"
```

## Testing

### Test Health Endpoint
```bash
curl https://your-site.pages.dev/api/health
```

Expected response:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Test Student Registration
```bash
curl -X POST https://your-site.pages.dev/api/students/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+254700000001",
    "course": "class-b"
  }'
```

### Test Dashboard Stats
```bash
curl https://your-site.pages.dev/api/dashboard/stats
```

## Advanced Features

### 1. Pagination

All list endpoints support pagination:

```javascript
GET /api/students/list?page=1&limit=20
```

### 2. Filtering

Filter by various criteria:

```javascript
GET /api/students/list?status=active&course=class-b
GET /api/lessons/list?date=2024-01-01&instructor=inst-001
GET /api/payments/list?student=student-001&startDate=2024-01-01
```

### 3. Query Parameters

All endpoints support query parameters:

```javascript
GET /api/messages/list?status=unread&student=student-001
```

### 4. Request Validation

Automatic validation with detailed error messages:

```json
{
  "success": false,
  "errors": {
    "email": "email must be a valid email",
    "phone": "phone is required"
  }
}
```

### 5. Error Responses

Consistent error format:

```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed error description"
}
```

## Performance Optimization

### 1. Database Indexes
Already created in schema:
- Student email index
- Payment date index
- Lesson date index

### 2. Query Optimization
- Use prepared statements
- Limit result sets
- Use LEFT JOIN instead of multiple queries
- Pagination for large datasets

### 3. Caching
Can be added:
```javascript
// Cache dashboard stats for 5 minutes
const cache = await caches.default;
const cacheKey = new Request(url, request);
let response = await cache.match(cacheKey);

if (!response) {
  response = await generateStats();
  ctx.waitUntil(cache.put(cacheKey, response.clone()));
}
```

### 4. Edge Computing
Cloudflare Workers run at the edge:
- Low latency worldwide
- Automatic scaling
- No cold starts

## Security

### 1. SQL Injection Protection
All queries use prepared statements:
```javascript
await ctx.env.DB.prepare('SELECT * FROM students WHERE id = ?')
  .bind(studentId)
  .first();
```

### 2. Input Validation
All inputs validated before processing:
```javascript
const validation = validate(body, {
  email: { required: true, type: 'email' },
  phone: { required: true, type: 'phone' }
});
```

### 3. CORS Configuration
Proper CORS headers on all responses:
```javascript
'Access-Control-Allow-Origin': '*'
'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
'Access-Control-Allow-Headers': 'Content-Type, Authorization'
```

### 4. Authentication (Ready)
JWT authentication can be added:
```javascript
// In middleware
const token = request.headers.get('Authorization');
const user = verifyToken(token);
if (!user) {
  return new Response('Unauthorized', { status: 401 });
}
```

### 5. Rate Limiting (Can be added)
```javascript
// Limit to 100 requests per minute
const rateLimiter = new RateLimiter(100, 60);
if (!await rateLimiter.check(clientIP)) {
  return new Response('Too many requests', { status: 429 });
}
```

## Monitoring

### 1. Cloudflare Dashboard
- View request logs
- Monitor error rates
- Check response times
- Track bandwidth usage

### 2. Custom Logging
All requests logged:
```
[2024-01-01T00:00:00.000Z] POST /api/students/register
```

### 3. Error Tracking
Errors logged with stack traces:
```javascript
console.error('Route handler error:', error);
```

### 4. Analytics
Can integrate with:
- Cloudflare Analytics
- Google Analytics
- Custom analytics

## Troubleshooting

### Issue: 404 Not Found
**Cause:** Route not registered or incorrect path
**Solution:** Check route registration in `app.js`

### Issue: 500 Internal Server Error
**Cause:** Database error or code error
**Solution:** Check Cloudflare logs for error details

### Issue: CORS Error
**Cause:** Missing CORS headers
**Solution:** Middleware automatically adds CORS headers

### Issue: Validation Error
**Cause:** Missing or invalid fields
**Solution:** Check validation rules in request

### Issue: Database Connection Error
**Cause:** D1 binding not configured
**Solution:** Verify `wrangler.toml` has correct database_id

## Next Steps

### 1. Deploy Backend (if using Workers)
```bash
wrangler deploy
```

### 2. Test All Endpoints
Use the test page: `/test-api.html`

### 3. Update Frontend
If using separate Worker, update API base URL in frontend

### 4. Add Authentication
Implement JWT authentication for secure access

### 5. Add Rate Limiting
Protect against abuse

### 6. Set Up Monitoring
Configure alerts for errors

### 7. Custom Domain
Add custom domain for API:
```
api.your-domain.com → Worker
your-domain.com → Pages
```

## Support Commands

```bash
# Deploy backend
wrangler deploy

# View logs
wrangler tail

# Test locally
wrangler dev

# Check database
wrangler d1 execute dsms-database --command="SELECT COUNT(*) FROM students;"

# Update database
wrangler d1 execute dsms-database --file=database/quick_setup.sql
```

## Summary

Your DSMS backend is now:
- ✅ Production-grade architecture
- ✅ Advanced routing system
- ✅ Request validation
- ✅ Error handling
- ✅ CORS support
- ✅ SQL injection protection
- ✅ Scalable and fast
- ✅ Edge computing
- ✅ Ready for deployment

**Your backend is ready to handle all DSMS operations!** 🚀
