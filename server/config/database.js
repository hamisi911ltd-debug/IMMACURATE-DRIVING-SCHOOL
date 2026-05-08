import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Database path
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../database/dsms.db')

// Create database connection
let db = null

export function getDatabase() {
  if (!db) {
    db = new Database(DB_PATH, {
      verbose: process.env.NODE_ENV === 'development' ? console.log : null
    })
    
    // Enable foreign keys
    db.pragma('foreign_keys = ON')
    
    // Set journal mode to WAL for better concurrency
    db.pragma('journal_mode = WAL')
    
    console.log(`✅ Database connected: ${DB_PATH}`)
  }
  
  return db
}

export function closeDatabase() {
  if (db) {
    db.close()
    db = null
    console.log('Database connection closed')
  }
}

// Helper function to run queries
export function query(sql, params = []) {
  const database = getDatabase()
  try {
    return database.prepare(sql).all(params)
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Helper function to get single row
export function queryOne(sql, params = []) {
  const database = getDatabase()
  try {
    return database.prepare(sql).get(params)
  } catch (error) {
    console.error('Database query error:', error)
    throw error
  }
}

// Helper function to run insert/update/delete
export function execute(sql, params = []) {
  const database = getDatabase()
  try {
    return database.prepare(sql).run(params)
  } catch (error) {
    console.error('Database execute error:', error)
    throw error
  }
}

// Helper function for transactions
export function transaction(callback) {
  const database = getDatabase()
  const trans = database.transaction(callback)
  return trans()
}

export default {
  getDatabase,
  closeDatabase,
  query,
  queryOne,
  execute,
  transaction
}
