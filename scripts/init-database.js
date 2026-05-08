// Database Initialization Script
const fs = require('fs');
const path = require('path');
const { db } = require('../config/database');

const schemaPath = path.join(__dirname, '../database/schema.sql');

console.log('='.repeat(50));
console.log('Initializing Database...');
console.log('='.repeat(50));

// Read schema file
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split into individual statements
const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0);

// Execute each statement
let completed = 0;
const total = statements.length;

statements.forEach((statement, index) => {
  db.run(statement + ';', (err) => {
    if (err) {
      console.error(`❌ Error executing statement ${index + 1}:`, err.message);
    } else {
      completed++;
      console.log(`✅ Executed statement ${completed}/${total}`);
    }
    
    if (completed === total) {
      console.log('='.repeat(50));
      console.log('✅ Database initialized successfully!');
      console.log('='.repeat(50));
      db.close();
      process.exit(0);
    }
  });
});
