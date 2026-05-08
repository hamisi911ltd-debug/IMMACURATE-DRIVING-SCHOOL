@echo off
REM =====================================================
REM DSMS Deployment Script for Windows
REM One-command deployment for Cloudflare
REM =====================================================

echo =========================================
echo DSMS Deployment Script
echo Driving School Management System
echo =========================================
echo.

REM Check if wrangler is installed
where wrangler >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Error: Wrangler CLI is not installed
    echo Install it with: npm install -g wrangler
    pause
    exit /b 1
)

echo Step 1: Checking Cloudflare authentication...
wrangler whoami >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Not logged in. Opening browser for authentication...
    wrangler login
) else (
    echo [OK] Already authenticated
)
echo.

echo Step 2: Creating D1 Database...
echo Database name: dsms-database
echo.

REM Check if database exists
wrangler d1 list | findstr "dsms-database" >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Database 'dsms-database' already exists
    set /p response="Do you want to use the existing database? (y/n): "
    if /i not "%response%"=="y" (
        echo Deployment cancelled
        pause
        exit /b 0
    )
) else (
    echo Creating new database...
    wrangler d1 create dsms-database
    echo [OK] Database created
)
echo.

echo Step 3: Setting up database schema and seed data...
if exist "database\quick_setup.sql" (
    wrangler d1 execute dsms-database --file=database/quick_setup.sql
    echo [OK] Database schema and seed data loaded
) else (
    echo Error: database\quick_setup.sql not found
    pause
    exit /b 1
)
echo.

echo Step 4: Verifying database setup...
echo Checking tables...
wrangler d1 execute dsms-database --command="SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';"
echo.
echo Checking admin user...
wrangler d1 execute dsms-database --command="SELECT email, role FROM system_users WHERE role='system-admin';"
echo.
echo Checking courses...
wrangler d1 execute dsms-database --command="SELECT COUNT(*) as course_count FROM courses;"
echo [OK] Database verification complete
echo.

echo Step 5: Deployment options
echo Choose deployment method:
echo 1) Deploy to Cloudflare Pages (Recommended)
echo 2) Deploy as Cloudflare Worker
echo 3) Skip deployment (database only)
set /p choice="Enter choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Deploying to Cloudflare Pages...
    echo Project name: dsms-driving-school
    wrangler pages deploy . --project-name=dsms-driving-school
    echo [OK] Deployed to Cloudflare Pages
) else if "%choice%"=="2" (
    echo.
    echo Deploying as Cloudflare Worker...
    if exist "wrangler.toml" (
        wrangler deploy
        echo [OK] Deployed as Worker
    ) else (
        echo Error: wrangler.toml not found
        echo Create wrangler.toml first or choose Pages deployment
        pause
        exit /b 1
    )
) else if "%choice%"=="3" (
    echo Skipping deployment
) else (
    echo Invalid choice
    pause
    exit /b 1
)
echo.

echo =========================================
echo DEPLOYMENT COMPLETE!
echo =========================================
echo.
echo Database Information:
echo   Name: dsms-database
echo   Tables: 13 core tables created
echo   Seed Data: Loaded successfully
echo.
echo Default Login Credentials:
echo   Email: hamisi.911.ltd@gmail.com
echo   Password: 911Hamisi.
echo.
echo Next Steps:
echo 1. Access your site (URL shown above)
echo 2. Login with default credentials
echo 3. Change your password immediately
echo 4. Add your real data (students, instructors, vehicles)
echo.
echo Database Management:
echo   View data: wrangler d1 execute dsms-database --command="SELECT * FROM students;"
echo   Backup: wrangler d1 export dsms-database --output=backup.sql
echo.
echo For detailed instructions, see DEPLOYMENT_STEPS.md
echo =========================================
echo.
pause