# MySQL Database Setup Guide

This guide will help you set up MySQL database for the Feather Press application.

## Prerequisites

1. **MySQL Server**: Make sure MySQL is installed and running on your system
2. **Node.js**: Ensure Node.js is installed (version 16 or higher)

## 1. Install MySQL

### Windows
- Download MySQL Installer from [mysql.com](https://dev.mysql.com/downloads/installer/)
- Run the installer and follow the setup wizard
- Remember the root password you set during installation

### macOS
```bash
# Using Homebrew
brew install mysql
brew services start mysql
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

## 2. Create Database

1. Connect to MySQL:
```bash
mysql -u root -p
```

2. Create the database:
```sql
CREATE DATABASE feather_press;
USE feather_press;
```

3. Exit MySQL:
```sql
EXIT;
```

## 3. Set Up Database Schema

Run the database setup script:
```bash
mysql -u root -p feather_press < database-setup.sql
```

This will create the `posts` table and insert some sample data.

## 4. Configure Environment Variables

1. Copy the environment example file:
```bash
cp env.example .env
```

2. Edit the `.env` file with your MySQL credentials:
```env
# MySQL Database Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password_here
MYSQL_DATABASE=feather_press

# Server Configuration
PORT=3001

# API Base URL (for frontend)
VITE_API_BASE_URL=http://localhost:3001/api
```

## 5. Install Dependencies

Install the required packages:
```bash
npm install
```

## 6. Start the Application

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev:full
```

### Option 2: Run Separately
Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## 7. Test the Setup

1. Open your browser and go to `http://localhost:5173/test-supabase`
2. You should see the MySQL Database Test Page
3. The connection status should show "Connected to MySQL database!"
4. Try creating a new post and viewing the posts list

## 8. API Endpoints

The backend server provides the following API endpoints:

- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get a specific post
- `POST /api/posts` - Create a new post
- `PUT /api/posts/:id` - Update a post
- `DELETE /api/posts/:id` - Delete a post
- `GET /api/health` - Health check

## 9. Database Schema

The `posts` table has the following structure:

```sql
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 10. Troubleshooting

### Connection Issues
- Make sure MySQL is running: `sudo systemctl status mysql` (Linux) or check MySQL Workbench
- Verify your credentials in the `.env` file
- Check if the database `feather_press` exists
- Ensure the port 3001 is not being used by another application

### Common Errors
- **"Access denied"**: Check your MySQL username and password
- **"Database doesn't exist"**: Create the database using the SQL commands above
- **"Port already in use"**: Change the PORT in your `.env` file or stop the conflicting service

### Reset Database
If you need to reset the database:
```bash
mysql -u root -p -e "DROP DATABASE IF EXISTS feather_press; CREATE DATABASE feather_press;"
mysql -u root -p feather_press < database-setup.sql
```

## 11. Production Considerations

For production deployment:

1. **Security**: Change default MySQL root password and create a dedicated user
2. **Environment Variables**: Use proper environment variable management
3. **SSL**: Enable SSL connections for MySQL
4. **Backup**: Set up regular database backups
5. **Monitoring**: Implement database monitoring and logging

## 12. Migration from Supabase

If you're migrating from Supabase:

1. Export your data from Supabase (if any)
2. Follow this setup guide
3. Import your data into the MySQL database
4. Update your frontend components to use the new API endpoints

The application has been updated to work with MySQL instead of Supabase, so all components should work seamlessly with the new setup.
