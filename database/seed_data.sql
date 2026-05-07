-- =====================================================
-- INITIAL DATA SEEDING FOR DSMS
-- =====================================================

-- =====================================================
-- SYSTEM USERS (Default Admin)
-- =====================================================
INSERT INTO system_users (user_id, name, email, phone, password_hash, role, status, created_by) VALUES
('admin-001', 'System Administrator', 'hamisi.911.ltd@gmail.com', '+254759159881', '$2b$10$hash_placeholder', 'system-admin', 'active', NULL);

-- =====================================================
-- DEFAULT COURSES
-- =====================================================
INSERT INTO courses (course_id, name, description, course_type, tuition_fee, pdl_fee, test_fee, total_fee, duration_weeks, total_lessons, theory_lessons, practical_lessons, created_by) VALUES
('class-a', 'Class A - Light Vehicle', 'Basic driving course for light vehicles including theory and practical sessions.', 'class-a', 7500.00, 650.00, 1050.00, 9200.00, 8, 15, 5, 10, 'admin-001'),
('class-b', 'Class B - Medium Vehicle', 'Comprehensive driving course for medium vehicles with full training program.', 'class-b', 12600.00, 650.00, 1050.00, 14300.00, 12, 20, 8, 12, 'admin-001'),
('class-c', 'Class C - Heavy Vehicle', 'Professional training for heavy vehicles and commercial driving license.', 'class-c', 13600.00, 650.00, 1050.00, 15300.00, 16, 25, 10, 15, 'admin-001'),
('class-b-half', 'Class B Half - Refresher Course', 'Refresher course for existing drivers upgrading their skills and license.', 'class-b-half', 8700.00, 650.00, 1050.00, 10400.00, 6, 12, 4, 8, 'admin-001'),
('class-d', 'Class D - Motorcycle', 'Motorcycle training course for Class D license with safety focus.', 'class-d', 9000.00, 550.00, 1050.00, 10600.00, 4, 10, 3, 7, 'admin-001'),
('class-c-half', 'Class C Half - Heavy Vehicle Refresher', 'Refresher course for heavy vehicle drivers upgrading their commercial license.', 'class-c-half', 9000.00, 550.00, 1050.00, 10600.00, 8, 15, 5, 10, 'admin-001'),
('class-ce', 'Class CE - Commercial Enhanced', 'Advanced commercial vehicle training for professional drivers and fleet operators.', 'class-ce', 35000.00, 550.00, 1050.00, 36600.00, 20, 30, 12, 18, 'admin-001');

-- =====================================================
-- DEFAULT INSTRUCTORS
-- =====================================================
INSERT INTO instructors (instructor_id, name, email, phone, license_number, specializations, hourly_rate, hire_date, created_by) VALUES
('inst-001', 'Peter Otieno', 'peter.otieno@immacurate.co.ke', '+254712000001', 'DL001234', '["class-a", "class-b", "class-b-half"]', 800.00, '2024-01-15', 'admin-001'),
('inst-002', 'Sarah Njeri', 'sarah.njeri@immacurate.co.ke', '+254722000002', 'DL001235', '["class-a", "class-b", "class-c"]', 850.00, '2024-02-01', 'admin-001'),
('inst-003', 'John Kamau', 'john.kamau@immacurate.co.ke', '+254733000003', 'DL001236', '["class-c", "class-c-half", "class-ce"]', 1000.00, '2024-01-20', 'admin-001'),
('inst-004', 'Mary Wanjiku', 'mary.wanjiku@immacurate.co.ke', '+254700000004', 'DL001237', '["class-d"]', 700.00, '2024-03-01', 'admin-001');

-- =====================================================
-- DEFAULT VEHICLES
-- =====================================================
INSERT INTO vehicles (vehicle_id, registration_number, make, model, year, vehicle_type, transmission, fuel_type, insurance_expiry, license_expiry, created_by) VALUES
('veh-001', 'KBZ 123A', 'Toyota', 'Vitz', 2020, 'light', 'manual', 'petrol', '2025-12-31', '2025-06-30', 'admin-001'),
('veh-002', 'KCF 456B', 'Honda', 'Fit', 2021, 'light', 'automatic', 'petrol', '2025-12-31', '2025-06-30', 'admin-001'),
('veh-003', 'KDE 789C', 'Nissan', 'Note', 2019, 'light', 'manual', 'petrol', '2025-12-31', '2025-06-30', 'admin-001'),
('veh-004', 'KAA 111D', 'Isuzu', 'NPR', 2018, 'medium', 'manual', 'diesel', '2025-12-31', '2025-06-30', 'admin-001'),
('veh-005', 'KBB 222E', 'Mitsubishi', 'Canter', 2019, 'medium', 'manual', 'diesel', '2025-12-31', '2025-06-30', 'admin-001'),
('veh-006', 'KCC 333F', 'Scania', 'R-Series', 2017, 'heavy', 'manual', 'diesel', '2025-12-31', '2025-06-30', 'admin-001'),
('veh-007', 'KDD 444G', 'Honda', 'CB150R', 2022, 'motorcycle', 'manual', 'petrol', '2025-12-31', '2025-06-30', 'admin-001');

-- =====================================================
-- SYSTEM SETTINGS
-- =====================================================
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('school_name', 'Immacurate Driving School', 'string', 'Official school name', TRUE),
('school_phone', '+254700000000', 'string', 'Main contact phone number', TRUE),
('school_email', 'info@immacurate.co.ke', 'string', 'Main contact email', TRUE),
('school_address', 'Nairobi, Kenya', 'string', 'School physical address', TRUE),
('currency', 'KES', 'string', 'Default currency', TRUE),
('timezone', 'Africa/Nairobi', 'string', 'School timezone', FALSE),
('receipt_counter', '1', 'number', 'Next receipt number', FALSE),
('default_lesson_duration', '60', 'number', 'Default lesson duration in minutes', FALSE),
('late_payment_fee', '500', 'number', 'Late payment penalty fee', FALSE),
('max_students_per_instructor', '8', 'number', 'Maximum students per instructor per day', FALSE),
('backup_frequency', 'daily', 'string', 'Database backup frequency', FALSE),
('notification_methods', '["email", "sms"]', 'json', 'Available notification methods', FALSE);

-- =====================================================
-- DEFAULT COURSE MATERIALS
-- =====================================================
INSERT INTO course_materials (material_id, course_id, title, description, material_type, is_required, order_index, uploaded_by) VALUES
-- Class A Materials
('mat-a-001', 'class-a', 'Traffic Rules Manual', 'Comprehensive guide to traffic rules and regulations', 'document', TRUE, 1, 'admin-001'),
('mat-a-002', 'class-a', 'Road Signs Guide', 'Visual guide to all road signs and their meanings', 'document', TRUE, 2, 'admin-001'),
('mat-a-003', 'class-a', 'Basic Vehicle Controls', 'Introduction to vehicle controls and operations', 'video', TRUE, 3, 'admin-001'),
('mat-a-004', 'class-a', 'Parking Techniques', 'Step-by-step parking instruction video', 'video', FALSE, 4, 'admin-001'),

-- Class B Materials
('mat-b-001', 'class-b', 'Advanced Traffic Rules', 'Advanced traffic rules for medium vehicles', 'document', TRUE, 1, 'admin-001'),
('mat-b-002', 'class-b', 'Vehicle Maintenance Basics', 'Basic vehicle maintenance and safety checks', 'document', TRUE, 2, 'admin-001'),
('mat-b-003', 'class-b', 'Highway Driving', 'Highway driving techniques and safety', 'video', TRUE, 3, 'admin-001'),
('mat-b-004', 'class-b', 'Emergency Procedures', 'What to do in emergency situations', 'document', TRUE, 4, 'admin-001'),

-- Class C Materials
('mat-c-001', 'class-c', 'Commercial Vehicle Regulations', 'Regulations specific to commercial vehicles', 'document', TRUE, 1, 'admin-001'),
('mat-c-002', 'class-c', 'Load Management', 'Proper loading and weight distribution', 'document', TRUE, 2, 'admin-001'),
('mat-c-003', 'class-c', 'Heavy Vehicle Handling', 'Techniques for handling heavy vehicles', 'video', TRUE, 3, 'admin-001'),

-- Class D Materials
('mat-d-001', 'class-d', 'Motorcycle Safety', 'Essential motorcycle safety guidelines', 'document', TRUE, 1, 'admin-001'),
('mat-d-002', 'class-d', 'Protective Gear Guide', 'Guide to motorcycle protective equipment', 'document', TRUE, 2, 'admin-001'),
('mat-d-003', 'class-d', 'Motorcycle Controls', 'Understanding motorcycle controls and operation', 'video', TRUE, 3, 'admin-001');

-- =====================================================
-- SAMPLE MESSAGE TEMPLATES
-- =====================================================
INSERT INTO messages (message_id, sender_type, sender_id, recipient_type, subject, message_body, message_type, priority, delivery_method, status) VALUES
('msg-template-001', 'system', 'admin-001', 'student', 'Welcome to Immacurate Driving School', 'Welcome to Immacurate Driving School! We are excited to have you join our driving program. Your journey to safe driving starts here. Please check your course materials and schedule in your student portal.', 'notification', 'normal', 'email', 'draft'),
('msg-template-002', 'system', 'admin-001', 'student', 'Lesson Reminder', 'Hi [Student Name], this is a reminder that you have a [Lesson Type] lesson scheduled for [Date] at [Time] with instructor [Instructor Name]. Please be on time and bring your learner''s permit.', 'reminder', 'normal', 'sms', 'draft'),
('msg-template-003', 'system', 'admin-001', 'student', 'Payment Due Reminder', 'Dear [Student Name], your payment of KES [Amount] is now due. Please make payment to continue your lessons. You can pay via M-Pesa, bank transfer, or visit our office.', 'reminder', 'high', 'sms', 'draft'),
('msg-template-004', 'system', 'admin-001', 'student', 'Congratulations on Passing!', 'Congratulations [Student Name] on successfully passing your driving test! We are proud of your achievement. Your certificate will be ready for collection within 3 working days.', 'notification', 'normal', 'email', 'draft');

-- =====================================================
-- RECEIPT COUNTER INITIALIZATION
-- =====================================================
-- This ensures receipt numbers start from 001
UPDATE system_settings SET setting_value = '1' WHERE setting_key = 'receipt_counter';

-- =====================================================
-- END OF SEED DATA
-- =====================================================