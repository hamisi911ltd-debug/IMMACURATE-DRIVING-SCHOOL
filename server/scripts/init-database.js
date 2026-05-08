import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'
import bcrypt from 'bcryptjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.join(__dirname, '../database/dsms.db')
const SCHEMA_PATH = path.join(__dirname, '../../database/schema.sql')

console.log('🚀 Initializing database...')

// Create database directory if it doesn't exist
const dbDir = path.dirname(DB_PATH)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

// Create database connection
const db = new Database(DB_PATH)

// Enable foreign keys
db.pragma('foreign_keys = ON')

// Read and execute schema
console.log('📄 Reading schema file...')
const schema = fs.readFileSync(SCHEMA_PATH, 'utf8')

// Split schema into individual statements
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0)

console.log(`📝 Executing ${statements.length} SQL statements...`)

// Execute each statement
for (const statement of statements) {
  try {
    db.exec(statement)
  } catch (error) {
    console.error('Error executing statement:', error.message)
    console.error('Statement:', statement.substring(0, 100) + '...')
  }
}

// Create default admin user
console.log('👤 Creating default admin user...')
const hashedPassword = bcrypt.hashSync('admin123', 10)

try {
  db.prepare(`
    INSERT INTO system_users (
      user_id, first_name, last_name, email, password_hash, role, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    'admin-001',
    'Admin',
    'User',
    'admin@immacurate.com',
    hashedPassword,
    'admin',
    'active'
  )
  console.log('✅ Default admin user created')
  console.log('   Email: admin@immacurate.com')
  console.log('   Password: admin123')
} catch (error) {
  console.log('ℹ️  Admin user already exists')
}

db.close()

console.log('✅ Database initialized successfully!')
console.log(`📍 Database location: ${DB_PATH}`)
