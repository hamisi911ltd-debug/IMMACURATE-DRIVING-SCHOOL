-- =====================================================
-- DRIVING SCHOOL MANAGEMENT SYSTEM DATABASE SCHEMA
-- For Cloudflare D1 Database
-- =====================================================

-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- =====================================================
-- SYSTEM USERS TABLE (Admins, Managers, Staff)
-- =====================================================
CREATE TABLE system_users (
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
    created_by TEXT,
    FOREIGN KEY (created_by) REFERENCES system_users(user_id)
);

-- =====================================================
-- COURSES TABLE
-- =====================================================
CREATE TABLE courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    course_type TEXT NOT NULL, -- 'class-a', 'class-b', 'class-c', etc.
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
    created_by TEXT,
    FOREIGN KEY (created_by) REFERENCES system_users(user_id)
);

-- =====================================================
-- STUDENTS TABLE
-- =====================================================
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    full_name TEXT GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
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
    created_by TEXT,
    FOREIGN KEY (created_by) REFERENCES system_users(user_id)
);

-- =====================================================
-- STUDENT ENROLLMENTS TABLE
-- =====================================================
CREATE TABLE student_enrollments (
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
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

-- =====================================================
-- INSTRUCTORS TABLE
-- =====================================================
CREATE TABLE instructors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    instructor_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT UNIQUE NOT NULL,
    license_number TEXT UNIQUE NOT NULL,
    specializations TEXT, -- JSON array of course types they can teach
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on-leave')),
    hire_date DATE,
    hourly_rate DECIMAL(8,2),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (created_by) REFERENCES system_users(user_id)
);

-- =====================================================
-- VEHICLES TABLE
-- =====================================================
CREATE TABLE vehicles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vehicle_id TEXT UNIQUE NOT NULL,
    registration_number TEXT UNIQUE NOT NULL,
    make TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER,
    vehicle_type TEXT NOT NULL, -- 'light', 'medium', 'heavy', 'motorcycle'
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
    created_by TEXT,
    FOREIGN KEY (created_by) REFERENCES system_users(user_id)
);

-- =====================================================
-- LESSONS TABLE
-- =====================================================
CREATE TABLE lessons (
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
    skills_practiced TEXT, -- JSON array of skills
    areas_for_improvement TEXT,
    completed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_by TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (instructor_id) REFERENCES instructors(instructor_id),
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(vehicle_id),
    FOREIGN KEY (created_by) REFERENCES system_users(user_id)
);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE payments (
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
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (enrollment_id) REFERENCES student_enrollments(enrollment_id),
    FOREIGN KEY (processed_by) REFERENCES system_users(user_id)
);

-- =====================================================
-- STUDENT BALANCES TABLE
-- =====================================================
CREATE TABLE student_balances (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT UNIQUE NOT NULL,
    total_fees DECIMAL(10,2) DEFAULT 0,
    total_paid DECIMAL(10,2) DEFAULT 0,
    balance_due DECIMAL(10,2) GENERATED ALWAYS AS (total_fees - total_paid) STORED,
    last_payment_date DATE,
    next_due_date DATE,
    status TEXT DEFAULT 'current' CHECK (status IN ('current', 'overdue', 'paid-in-full')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(student_id)
);

-- =====================================================
-- MESSAGES TABLE
-- =====================================================
CREATE TABLE messages (
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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES system_users(user_id)
);

-- =====================================================
-- COURSE MATERIALS TABLE
-- =====================================================
CREATE TABLE course_materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    material_id TEXT UNIQUE NOT NULL,
    course_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    material_type TEXT NOT NULL CHECK (material_type IN ('document', 'video', 'audio', 'image', 'link')),
    file_name TEXT,
    file_path TEXT,
    file_size INTEGER,
    mime_type TEXT,
    url TEXT,
    is_required BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    uploaded_by TEXT,
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (uploaded_by) REFERENCES system_users(user_id)
);

-- =====================================================
-- STUDENT PROGRESS TABLE
-- =====================================================
CREATE TABLE student_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    course_id TEXT NOT NULL,
    material_id TEXT,
    lesson_id TEXT,
    progress_type TEXT NOT NULL CHECK (progress_type IN ('material-viewed', 'lesson-completed', 'test-passed', 'skill-mastered')),
    completion_percentage DECIMAL(5,2) DEFAULT 0,
    score DECIMAL(5,2),
    max_score DECIMAL(5,2),
    attempts INTEGER DEFAULT 1,
    time_spent_minutes INTEGER,
    completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (course_id) REFERENCES courses(course_id),
    FOREIGN KEY (material_id) REFERENCES course_materials(material_id),
    FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id)
);

-- =====================================================
-- SYSTEM SETTINGS TABLE
-- =====================================================
CREATE TABLE system_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT,
    setting_type TEXT DEFAULT 'string' CHECK (setting_type IN ('string', 'number', 'boolean', 'json')),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_by TEXT,
    FOREIGN KEY (updated_by) REFERENCES system_users(user_id)
);

-- =====================================================
-- AUDIT LOG TABLE
-- =====================================================
CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    action TEXT NOT NULL,
    table_name TEXT NOT NULL,
    record_id TEXT,
    old_values TEXT, -- JSON
    new_values TEXT, -- JSON
    ip_address TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES system_users(user_id)
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- System Users indexes
CREATE INDEX idx_system_users_email ON system_users(email);
CREATE INDEX idx_system_users_role ON system_users(role);
CREATE INDEX idx_system_users_status ON system_users(status);

-- Students indexes
CREATE INDEX idx_students_email ON students(email);
CREATE INDEX idx_students_phone ON students(phone);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_enrollment_date ON students(enrollment_date);

-- Student Enrollments indexes
CREATE INDEX idx_enrollments_student_id ON student_enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON student_enrollments(course_id);
CREATE INDEX idx_enrollments_status ON student_enrollments(status);

-- Lessons indexes
CREATE INDEX idx_lessons_student_id ON lessons(student_id);
CREATE INDEX idx_lessons_instructor_id ON lessons(instructor_id);
CREATE INDEX idx_lessons_scheduled_date ON lessons(scheduled_date);
CREATE INDEX idx_lessons_status ON lessons(status);

-- Payments indexes
CREATE INDEX idx_payments_student_id ON payments(student_id);
CREATE INDEX idx_payments_payment_date ON payments(payment_date);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_receipt_number ON payments(receipt_number);

-- Messages indexes
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);
CREATE INDEX idx_messages_status ON messages(status);

-- Course Materials indexes
CREATE INDEX idx_materials_course_id ON course_materials(course_id);
CREATE INDEX idx_materials_type ON course_materials(material_type);

-- Student Progress indexes
CREATE INDEX idx_progress_student_id ON student_progress(student_id);
CREATE INDEX idx_progress_course_id ON student_progress(course_id);

-- Audit Log indexes
CREATE INDEX idx_audit_user_id ON audit_log(user_id);
CREATE INDEX idx_audit_table_name ON audit_log(table_name);
CREATE INDEX idx_audit_created_at ON audit_log(created_at);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Update timestamp triggers
CREATE TRIGGER update_system_users_timestamp 
    AFTER UPDATE ON system_users
    BEGIN
        UPDATE system_users SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_students_timestamp 
    AFTER UPDATE ON students
    BEGIN
        UPDATE students SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_courses_timestamp 
    AFTER UPDATE ON courses
    BEGIN
        UPDATE courses SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_enrollments_timestamp 
    AFTER UPDATE ON student_enrollments
    BEGIN
        UPDATE student_enrollments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_lessons_timestamp 
    AFTER UPDATE ON lessons
    BEGIN
        UPDATE lessons SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

CREATE TRIGGER update_payments_timestamp 
    AFTER UPDATE ON payments
    BEGIN
        UPDATE payments SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Update student balance when payment is made
CREATE TRIGGER update_student_balance_on_payment
    AFTER INSERT ON payments
    WHEN NEW.status = 'completed'
    BEGIN
        INSERT OR REPLACE INTO student_balances (student_id, total_paid, last_payment_date, updated_at)
        VALUES (
            NEW.student_id,
            COALESCE((SELECT total_paid FROM student_balances WHERE student_id = NEW.student_id), 0) + NEW.amount,
            NEW.payment_date,
            CURRENT_TIMESTAMP
        );
    END;

-- Update enrollment progress when lesson is completed
CREATE TRIGGER update_enrollment_progress
    AFTER UPDATE ON lessons
    WHEN NEW.status = 'completed' AND OLD.status != 'completed'
    BEGIN
        UPDATE student_enrollments 
        SET 
            lessons_completed = lessons_completed + 1,
            progress_percentage = ROUND((lessons_completed + 1) * 100.0 / (SELECT total_lessons FROM courses WHERE course_id = NEW.course_id), 2),
            updated_at = CURRENT_TIMESTAMP
        WHERE student_id = NEW.student_id AND course_id = NEW.course_id;
    END;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- Student Dashboard View
CREATE VIEW student_dashboard AS
SELECT 
    s.student_id,
    s.full_name,
    s.email,
    s.phone,
    s.status,
    se.course_id,
    c.name as course_name,
    se.progress_percentage,
    se.lessons_completed,
    c.total_lessons,
    sb.balance_due,
    sb.status as payment_status,
    s.enrollment_date
FROM students s
LEFT JOIN student_enrollments se ON s.student_id = se.student_id
LEFT JOIN courses c ON se.course_id = c.course_id
LEFT JOIN student_balances sb ON s.student_id = sb.student_id;

-- Instructor Schedule View
CREATE VIEW instructor_schedule AS
SELECT 
    l.lesson_id,
    l.scheduled_date,
    l.scheduled_time,
    l.duration_minutes,
    l.lesson_type,
    l.status,
    i.name as instructor_name,
    s.full_name as student_name,
    c.name as course_name,
    v.registration_number as vehicle_reg,
    l.location
FROM lessons l
JOIN instructors i ON l.instructor_id = i.instructor_id
JOIN students s ON l.student_id = s.student_id
JOIN courses c ON l.course_id = c.course_id
LEFT JOIN vehicles v ON l.vehicle_id = v.vehicle_id
WHERE l.status IN ('scheduled', 'in-progress');

-- Payment Summary View
CREATE VIEW payment_summary AS
SELECT 
    p.student_id,
    s.full_name as student_name,
    COUNT(p.id) as total_payments,
    SUM(p.amount) as total_paid,
    MAX(p.payment_date) as last_payment_date,
    sb.balance_due
FROM payments p
JOIN students s ON p.student_id = s.student_id
LEFT JOIN student_balances sb ON p.student_id = sb.student_id
WHERE p.status = 'completed'
GROUP BY p.student_id, s.full_name, sb.balance_due;

-- =====================================================
-- END OF SCHEMA
-- =====================================================