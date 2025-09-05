import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

async function testConnection() {
  try {
    const sslEnabled = process.env.MYSQL_SSL === 'true';
    const rejectUnauthorized = String(process.env.MYSQL_SSL_REJECT_UNAUTHORIZED || 'true').toLowerCase() === 'true';
    const caPath = process.env.MYSQL_SSL_CA_PATH ? path.resolve(process.env.MYSQL_SSL_CA_PATH) : undefined;
    let ssl = undefined;
    if (sslEnabled) {
      ssl = { rejectUnauthorized };
      if (caPath && fs.existsSync(caPath)) {
        try {
          ssl.ca = fs.readFileSync(caPath, 'utf8');
        } catch {}
      }
    }
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      ssl,
    });

    const [rows] = await connection.query('SELECT NOW() AS now');
    console.log('✅ Connected successfully! Server time:', rows[0].now);

    await connection.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();


