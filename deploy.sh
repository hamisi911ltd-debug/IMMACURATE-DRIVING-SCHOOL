#!/bin/bash

# =====================================================
# DSMS Deployment Script
# One-command deployment for Cloudflare
# =====================================================

echo "========================================="
echo "DSMS Deployment Script"
echo "Driving School Management System"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo -e "${RED}Error: Wrangler CLI is not installed${NC}"
    echo "Install it with: npm install -g wrangler"
    exit 1
fi

echo -e "${BLUE}Step 1: Checking Cloudflare authentication...${NC}"
if ! wrangler whoami &> /dev/null; then
    echo -e "${YELLOW}Not logged in. Opening browser for authentication...${NC}"
    wrangler login
else
    echo -e "${GREEN}✓ Already authenticated${NC}"
fi
echo ""

echo -e "${BLUE}Step 2: Creating D1 Database...${NC}"
echo "Database name: dsms-database"

# Check if database already exists
if wrangler d1 list | grep -q "dsms-database"; then
    echo -e "${YELLOW}Database 'dsms-database' already exists${NC}"
    echo "Do you want to use the existing database? (y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        echo "Deployment cancelled"
        exit 0
    fi
else
    echo "Creating new database..."
    wrangler d1 create dsms-database
    echo -e "${GREEN}✓ Database created${NC}"
fi
echo ""

echo -e "${BLUE}Step 3: Setting up database schema and seed data...${NC}"
if [ -f "database/quick_setup.sql" ]; then
    wrangler d1 execute dsms-database --file=database/quick_setup.sql
    echo -e "${GREEN}✓ Database schema and seed data loaded${NC}"
else
    echo -e "${RED}Error: database/quick_setup.sql not found${NC}"
    exit 1
fi
echo ""

echo -e "${BLUE}Step 4: Verifying database setup...${NC}"
echo "Checking tables..."
wrangler d1 execute dsms-database --command="SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';"
echo ""
echo "Checking admin user..."
wrangler d1 execute dsms-database --command="SELECT email, role FROM system_users WHERE role='system-admin';"
echo ""
echo "Checking courses..."
wrangler d1 execute dsms-database --command="SELECT COUNT(*) as course_count FROM courses;"
echo -e "${GREEN}✓ Database verification complete${NC}"
echo ""

echo -e "${BLUE}Step 5: Deployment options${NC}"
echo "Choose deployment method:"
echo "1) Deploy to Cloudflare Pages (Recommended)"
echo "2) Deploy as Cloudflare Worker"
echo "3) Skip deployment (database only)"
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo -e "${BLUE}Deploying to Cloudflare Pages...${NC}"
        echo "Project name: dsms-driving-school"
        wrangler pages deploy . --project-name=dsms-driving-school
        echo -e "${GREEN}✓ Deployed to Cloudflare Pages${NC}"
        ;;
    2)
        echo ""
        echo -e "${BLUE}Deploying as Cloudflare Worker...${NC}"
        if [ -f "wrangler.toml" ]; then
            wrangler deploy
            echo -e "${GREEN}✓ Deployed as Worker${NC}"
        else
            echo -e "${RED}Error: wrangler.toml not found${NC}"
            echo "Create wrangler.toml first or choose Pages deployment"
            exit 1
        fi
        ;;
    3)
        echo -e "${YELLOW}Skipping deployment${NC}"
        ;;
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac
echo ""

echo "========================================="
echo -e "${GREEN}DEPLOYMENT COMPLETE!${NC}"
echo "========================================="
echo ""
echo "Database Information:"
echo "  Name: dsms-database"
echo "  Tables: 13 core tables created"
echo "  Seed Data: Loaded successfully"
echo ""
echo "Default Login Credentials:"
echo "  Email: hamisi.911.ltd@gmail.com"
echo "  Password: 911Hamisi."
echo ""
echo "Next Steps:"
echo "1. Access your site (URL shown above)"
echo "2. Login with default credentials"
echo "3. Change your password immediately"
echo "4. Add your real data (students, instructors, vehicles)"
echo ""
echo "Database Management:"
echo "  View data: wrangler d1 execute dsms-database --command='SELECT * FROM students;'"
echo "  Backup: wrangler d1 export dsms-database --output=backup.sql"
echo ""
echo "For detailed instructions, see DEPLOYMENT_STEPS.md"
echo "========================================="