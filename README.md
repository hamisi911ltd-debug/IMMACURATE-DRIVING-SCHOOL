# Driving School Management System (DSMS)

A modern, responsive web application for managing driving school operations.

## Framework & Technology

This is a **Static HTML/CSS/JavaScript Application** - no backend framework required!

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with CSS Variables
- **Icons**: SVG icons (inline)
- **Storage**: LocalStorage for data persistence
- **Responsive**: Mobile-first design

## Features

- **Dashboard**: Overview of students, courses, and revenue
- **Student Management**: Register and track student progress
- **Course Management**: Manage different driving course types
- **Schedule Management**: Lesson scheduling and calendar
- **Payment Tracking**: Record and monitor payments
- **Communication**: Message system for student communication
- **Reports**: Generate various business reports
- **User Management**: Admin and manager roles

## Default Login

- **Username**: `hamisi.911.ltd@gmail.com`
- **Password**: `911Hamisi.`

## Cloudflare Deployment Options

Since this is a static application, you can deploy it using any of these Cloudflare services:

### 1. Cloudflare Pages (Recommended)
- **Best for**: Static sites with Git integration
- **Cost**: Free tier available
- **Features**: Automatic deployments, custom domains, SSL

### 2. Cloudflare Workers Sites
- **Best for**: Static sites with edge computing needs
- **Cost**: Free tier available (100,000 requests/day)
- **Features**: Global edge deployment, custom logic

### 3. Cloudflare R2 + Custom Domain
- **Best for**: Simple static hosting
- **Cost**: Very low cost storage
- **Features**: Object storage with CDN

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
└── assets/           # Images and media
```

## Setup Instructions

1. **Download/Clone** the project files
2. **Upload** all files to your hosting service
3. **Set** `index.html` as the default page
4. **Configure** custom domain (optional)
5. **Access** the application and login with default credentials

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
- This is a client-side application - sensitive data is stored in browser localStorage
- For production use, consider implementing proper backend authentication
- HTTPS is recommended for production deployment

## Support

This is a clean, ready-to-deploy driving school management system. All sample data has been removed and only the default admin login remains.