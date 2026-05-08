-- =====================================================
-- QUICK SETUP SCRIPT FOR CLOUDFLARE D1
-- Run this after creating your D1 database
-- =====================================================

-- This script creates all tables and inserts seed data in one go

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- =====================================================
-- CREATE ALL TABLES
-- =====================================================

-- System Users Table
CREATE TABLE IF NOT EXISTS system_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('system-admin', 'admin', 'manager', 'instructor')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
);

-- Courses Table
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    course_type TEXT NOT NULL,
    tuition_fee DECIMAL(10,2) NOT NULL,
    pdl_fee DECIMAL(10,2) DEFAULT 0,
    test_fee DECIMAL(10,2) DEFAULT 0,
    total_fee DECIMAL(10,2) NOT NULL,
    duration_weeks INTEGER,
    total_lessons INTEGER,
    theory_lessons INTEGER DEFAULT 0,
    practical_lessons INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    icon TEXT DEFAULT 'Car',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    date_of_birth DATE,
    address TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    id_number TEXT UNIQUE,
    license_number TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'suspended', 'dropped')),
    enrollment_date DATE DEFAULT (DATE('now')),
    graduation_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
);

-- Student Enrollments Table
CREATE TABLE IF NOT EXISTS student_enrollments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    enrollment_id TEXT UNIQUE NOT NULL,
    student_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    enrollment_date DATE DEFAULT (DATE('now')),
    expected_completion_date DATE,
    actual_completion_date DATE,
    status TEXT DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in-progress', 'completed', 'dropped', 'suspended')),
    progress_percentage DECIMAL(5,2) DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    lessons_remaining INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Instructors Table
CREATE TABLE IF NOT EXISTS instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    instructor_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    specializations TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on-leave')),
    hire_date DATE,
    hourly_rate DECIMAL(8,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
);

-- Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT UNIQUE NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    vehicle_type TEXT NOT NULL,
    transmission TEXT CHECK (transmission IN ('manual', 'automatic')),
    fuel_type TEXT CHECK (fuel_type IN ('petrol', 'diesel', 'electric', 'hybrid')),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in-use', 'maintenance', 'out-of-service')),
    insurance_expiry DATE,
    license_expiry DATE,
    last_service_date DATE,
    next_service_date DATE,
    mileage INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
);

-- Lessons Table
CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id TEXT UNIQUE NOT NULL,
    student_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    instructor_id TEXT NOT NULL,
    vehicle_id TEXT,
    lesson_type TEXT NOT NULL CHECK (lesson_type IN ('theory', 'practical', 'mock-test', 'final-test')),
    lesson_number INTEGER,
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    location TEXT,
    route_description TEXT,
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in-progress', 'completed', 'cancelled', 'no-show')),
    attendance_status TEXT CHECK (attendance_status IN ('present', 'absent', 'late')),
    lesson_notes TEXT,
    instructor_feedback TEXT,
    student_performance_rating INTEGER CHECK (student_performance_rating BETWEEN 1 AND 5),
    skills_practiced TEXT,
    areas_for_improvement TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_id TEXT UNIQUE NOT NULL,
    receipt_number TEXT UNIQUE NOT NULL,
    student_id TEXT NOT NULL,
    course_id TEXT,
    enrollment_id TEXT,
    amount DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'mpesa', 'bank-transfer', 'card', 'cheque')),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('tuition', 'registration', 'test-fee', 'late-fee', 'other')),
    reference_number TEXT,
    transaction_id TEXT,
    payment_date DATE DEFAULT (DATE('now')),
    due_date DATE,
    status TEXT DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    notes TEXT,
    processed_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Student Balances Table
CREATE TABLE IF NOT EXISTS student_balances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    total_fees DECIMAL(10,2) DEFAULT 0,
    total_paid DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) DEFAULT 0,
    last_payment_date DATE,
    next_due_date DATE,
    status TEXT DEFAULT 'current' CHECK (status IN ('current', 'overdue', 'paid-in-full')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id TEXT UNIQUE NOT NULL,
    sender_type TEXT NOT NULL CHECK (sender_type IN ('system', 'admin', 'instructor', 'student')),
    sender_id TEXT,
    recipient_type TEXT NOT NULL CHECK (recipient_type IN ('student', 'instructor', 'admin', 'all')),
    recipient_id TEXT,
    subject TEXT,
    message_body TEXT NOT NULL,
    message_type TEXT DEFAULT 'general' CHECK (message_type IN ('general', 'reminder', 'announcement', 'alert', 'notification')),
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    delivery_method TEXT DEFAULT 'internal' CHECK (delivery_method IN ('internal', 'email', 'sms', 'whatsapp')),
    status TEXT DEFAULT 'sent' CHECK (status IN ('draft', 'sent', 'delivered', 'read', 'failed')),
    read_at DATETIME,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT
);

-- =====================================================
-- INSERT SEED DATA
-- =====================================================

-- Default Admin User
INSERT INTO system_users (user_id, name, email, phone, password_hash, role, status) 
VALUES ('admin-001', 'System Administrator', 'hamisi.911.ltd@gmail.com', '+254759159881', '$2b$10$placeholder', 'system-admin', 'active');

-- Default Courses
INSERT INTO courses (course_id, name, description, course_type, tuition_fee, pdl_fee, test_fee, total_fee, duration_weeks, total_lessons, theory_lessons, practical_lessons, created_by) VALUES
('class-a', 'Class A - Light Vehicle', 'Basic driving course for light vehicles including theory and practical sessions.', 'class-a', 7500.00, 650.00, 1050.00, 9200.00, 8, 15, 5, 10, 'admin-001'),
('class-b', 'Class B - Medium Vehicle', 'Comprehensive driving course for medium vehicles with full training program.', 'class-b', 12600.00, 650.00, 1050.00, 14300.00, 12, 20, 8, 12, 'admin-001'),
('class-c', 'Class C - Heavy Vehicle', 'Professional training for heavy vehicles and commercial driving license.', 'class-c', 13600.00, 650.00, 1050.00, 15300.00, 16, 25, 10, 15, 'admin-001'),
('class-b-half', 'Class B Half - Refresher Course', 'Refresher course for existing drivers upgrading their skills and license.', 'class-b-half', 8700.00, 650.00, 1050.00, 10400.00, 6, 12, 4, 8, 'admin-001'),
('class-d', 'Class D - Motorcycle', 'Motorcycle training course for Class D license with safety focus.', 'class-d', 9000.00, 550.00, 1050.00, 10600.00, 4, 10, 3, 7, 'admin-001'),
('class-c-half', 'Class C Half - Heavy Vehicle Refresher', 'Refresher course for heavy vehicle drivers upgrading their commercial license.', 'class-c-half', 9000.00, 550.00, 1050.00, 10600.00, 8, 15, 5, 10, 'admin-001'),
('class-ce', 'Class CE - Commercial Enhanced', 'Advanced commercial vehicle training for professional drivers and fleet operators.', 'class-ce', 35000.00, 550.00, 1050.00, 36600.00, 20, 30, 12, 18, 'admin-001');

-- Default Instructors
INSERT INTO instructors (instructor_id, name, email, phone, license_number, specializations, hourly_rate, hire_date, created_by) VALUES
('inst-001', 'Peter Otieno', 'peter.otieno@immacurate.co.ke', '+254712000001', 'DL001234', '["class-a", "class-b", "class-b-half"]', 800.00, '2024-01-15', 'admin-001'),
('inst-002', 'Sarah Njeri', 'sarah.njeri@immacurate.co.ke', '+254722000002', 'DL001235', '["class-a", "class-b", "class-c"]', 850.00, '2024-02-01', 'admin-001'),
('inst-003', 'John Kamau', 'john.kamau@immacurate.co.ke', '+254733000003', 'DL001236', '["class-c", "class-c-half", "class-ce"]', 1000.00, '2024-01-20', 'admin-001');

-- Default Vehicles
INSERT INTO vehicles (vehicle_id, registration_number, make, model, year, vehicle_type, transmission, fuel_type, insurance_expiry, license_expiry, created_by) VALUES
('veh-001', 'KBZ 123A', 'Toyota', 'Vitz', 2020, 'light', 'manual', 'petrol', '2025-12-31', '2025-06-30', 'admin-001'),
('veh-002', 'KCF 456B', 'Honda', 'Fit', 2021, 'light', 'automatic', 'petrol', '2025-12-31', '2025-06-30', 'admin-001'),
('veh-003', 'KDE 789C', 'Nissan', 'Note', 2019, 'light', 'manual', 'petrol', '2025-12-31', '2025-06-30', 'admin-001');

-- System Settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('school_name', 'Immacurate Driving School', 'string', 'Official school name', 1),
('school_phone', '+254700000000', 'string', 'Main contact phone number', 1),
('school_email', 'info@immacurate.co.ke', 'string', 'Main contact email', 1),
('currency', 'KES', 'string', 'Default currency', 1),
('receipt_counter', '1', 'number', 'Next receipt number', 0),
('default_lesson_duration', '60', 'number', 'Default lesson duration in minutes', 0);

-- =====================================================
-- CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_system_users_email ON system_users(email);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_phone ON students(phone);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON student_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_lessons_student_id ON lessons(student_id);
CREATE INDEX IF NOT EXISTS idx_lessons_scheduled_date ON lessons(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_receipt_number ON payments(receipt_number);

-- =====================================================
-- SETUP COMPLETE
-- =====================================================