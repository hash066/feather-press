import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3307'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'Ganesha123*',
    database: process.env.MYSQL_DATABASE || 'feather_press'
  };

  console.log('Attempting to connect with config:', {
    ...config,
    password: '***' // Don't log the actual password
  });

  try {
    const connection = await mysql.createConnection(config);
    console.log('Successfully connected to MySQL!');
    const [rows] = await connection.execute('SELECT VERSION()');
    console.log('MySQL Version:', rows[0]['VERSION()']);
    await connection.end();
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  }
}

testConnection().then(success => {
  console.log(success ? 'Test completed successfully!' : 'Test failed!');
  process.exit(success ? 0 : 1);
});
