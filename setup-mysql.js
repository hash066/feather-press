#!/usr/bin/env node

/**
 * MySQL Setup Script for Feather Press
 * This script helps you set up the MySQL database and environment
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupMySQL() {
  console.log('🚀 Feather Press MySQL Setup');
  console.log('============================\n');

  try {
    // Check if .env file exists
    if (!fs.existsSync('.env')) {
      console.log('📝 Creating .env file from template...');
      fs.copyFileSync('env.example', '.env');
      console.log('✅ .env file created!\n');
    } else {
      console.log('✅ .env file already exists\n');
    }

    // Get MySQL credentials
    console.log('🔐 Please provide your MySQL database credentials:');
    const host = await question('MySQL Host (default: localhost): ') || 'localhost';
    const port = await question('MySQL Port (default: 3306): ') || '3306';
    const user = await question('MySQL Username (default: root): ') || 'root';
    const password = await question('MySQL Password: ');
    const database = await question('Database Name (default: feather_press): ') || 'feather_press';

    // Update .env file
    console.log('\n📝 Updating .env file with your credentials...');
    const envContent = `# MySQL Database Configuration
MYSQL_HOST=${host}
MYSQL_PORT=${port}
MYSQL_USER=${user}
MYSQL_PASSWORD=${password}
MYSQL_DATABASE=${database}

# Server Configuration
PORT=3001

# API Base URL (for frontend)
VITE_API_BASE_URL=http://localhost:3001/api
`;

    fs.writeFileSync('.env', envContent);
    console.log('✅ .env file updated!\n');

    // Test MySQL connection
    console.log('🔍 Testing MySQL connection...');
    try {
      const mysql = await import('mysql2/promise');
      const connection = await mysql.createConnection({
        host,
        port: parseInt(port),
        user,
        password,
        database
      });
      
      console.log('✅ MySQL connection successful!\n');
      
      // Create tables
      console.log('📊 Setting up database tables...');
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS posts (
          id INT AUTO_INCREMENT PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Insert sample data
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM posts');
      if (rows[0].count === 0) {
        await connection.execute(`
          INSERT INTO posts (title, content) VALUES 
          ('Welcome to Feather Press', 'This is your first post! You can edit or delete it from the admin panel.'),
          ('Getting Started', 'Feather Press is now connected to MySQL database. You can create, read, update, and delete posts through the API.')
        `);
        console.log('✅ Sample data inserted!');
      }
      
      await connection.end();
      console.log('✅ Database setup complete!\n');
      
    } catch (error) {
      console.log('❌ MySQL connection failed:', error.message);
      console.log('\n📋 Manual setup required:');
      console.log('1. Make sure MySQL is running');
      console.log('2. Create the database manually:');
      console.log(`   mysql -u ${user} -p -e "CREATE DATABASE ${database};"`);
      console.log('3. Run the database setup:');
      console.log(`   mysql -u ${user} -p ${database} < database-setup.sql`);
      console.log('\n');
    }

    console.log('🎉 Setup Complete!');
    console.log('==================');
    console.log('Next steps:');
    console.log('1. Start the backend server: npm run dev:server');
    console.log('2. Start the frontend: npm run dev');
    console.log('3. Or run both together: npm run dev:full');
    console.log('4. Visit http://localhost:5173/test-supabase to test the setup');
    console.log('\n📚 For more information, see MYSQL_SETUP.md');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
  } finally {
    rl.close();
  }
}

setupMySQL();
