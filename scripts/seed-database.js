// Database Seeding Script
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { db, dbRun } = require('../config/database');

console.log('='.repeat(50));
console.log('Seeding Database...');
console.log('='.repeat(50));

async function seedDatabase() {
  try {
    // 1. Create default admin user
    console.log('Creating default admin user...');
    const hashedPassword = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD || '911Hamisi.', 10);
    
    await dbRun(`
      INSERT OR REPLACE INTO system_users (
        user_id, first_name, last_name, email, password_hash, role, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      'admin-001',
      'Admin',
      'User',
      process.env.DEFAULT_ADMIN_EMAIL || 'hamisi.911.ltd@gmail.com',
      hashedPassword,
      'system-admin',
      'active'
    ]);
    console.log('✅ Admin user created');

    // 2. Seed courses
    console.log('Seeding courses...');
    const courses = [
      ['class-a', 'Class A - Motorcycles', 'Motorcycle riding course', 15, 4, 25000, 10, 5],
      ['class-b', 'Class B - Light Vehicles', 'Light vehicle driving course', 30, 8, 45000, 20, 10],
      ['class-c', 'Class C - Medium Vehicles', 'Medium vehicle driving course', 35, 10, 55000, 25, 10],
      ['class-d', 'Class D - Heavy Vehicles', 'Heavy vehicle driving course', 40, 12, 65000, 30, 10],
      ['class-e', 'Class E - Articulated Vehicles', 'Articulated vehicle driving course', 45, 14, 75000, 35, 10],
      ['class-ce', 'Class CE - Trailer Combination', 'Trailer combination driving course', 50, 16, 85000, 40, 10]
    ];

    for (const course of courses) {
      await dbRun(`
        INSERT OR REPLACE INTO courses (
          course_id, name, description, total_lessons, duration_weeks,
          total_fee, theory_hours, practical_hours, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active')
      `, course);
    }
    console.log('✅ Courses seeded');

    // 3. Seed instructors
    console.log('Seeding instructors...');
    const instructors = [
      ['inst-001', 'Peter', 'Otieno', 'peter@immacurate.com', '+254712345678', 'DL-12345', 'Class B, C, D'],
      ['inst-002', 'Mary', 'Wanjiku', 'mary@immacurate.com', '+254723456789', 'DL-23456', 'Class A, B'],
      ['inst-003', 'John', 'Kamau', 'john@immacurate.com', '+254734567890', 'DL-34567', 'Class D, E, CE']
    ];

    for (const instructor of instructors) {
      await dbRun(`
        INSERT OR REPLACE INTO instructors (
          instructor_id, first_name, last_name, email, phone,
          license_number, specialization, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
      `, instructor);
    }
    console.log('✅ Instructors seeded');

    // 4. Seed vehicles
    console.log('Seeding vehicles...');
    const vehicles = [
      ['veh-001', 'KBZ 123A', 'Toyota', 'Corolla', 2020, 'Class B'],
      ['veh-002', 'KCA 456B', 'Isuzu', 'FRR', 2019, 'Class D'],
      ['veh-003', 'KCB 789C', 'Yamaha', 'YBR 125', 2021, 'Class A']
    ];

    for (const vehicle of vehicles) {
      await dbRun(`
        INSERT OR REPLACE INTO vehicles (
          vehicle_id, registration_number, make, model, year,
          vehicle_type, status
        ) VALUES (?, ?, ?, ?, ?, ?, 'active')
      `, vehicle);
    }
    console.log('✅ Vehicles seeded');

    console.log('='.repeat(50));
    console.log('✅ Database seeded successfully!');
    console.log('='.repeat(50));
    console.log('Default Admin Credentials:');
    console.log(`Email: ${process.env.DEFAULT_ADMIN_EMAIL || 'hamisi.911.ltd@gmail.com'}`);
    console.log(`Password: ${process.env.DEFAULT_ADMIN_PASSWORD || '911Hamisi.'}`);
    console.log('='.repeat(50));
    
    db.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    db.close();
    process.exit(1);
  }
}

seedDatabase();
