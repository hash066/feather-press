-- Create missing tables for Feather Press
USE feather_press;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    author VARCHAR(255),
    created_by VARCHAR(255),
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_author (author),
    INDEX idx_created_by (created_by)
);

-- Create galleries table
CREATE TABLE IF NOT EXISTS galleries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    images JSON,
    created_by VARCHAR(255),
    tags VARCHAR(500),
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_created_by (created_by)
);

-- Create audios table
CREATE TABLE IF NOT EXISTS audios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    duration INT,
    created_by VARCHAR(255),
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_created_by (created_by)
);

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    file_url VARCHAR(500) NOT NULL,
    thumbnail_url VARCHAR(500),
    duration INT,
    created_by VARCHAR(255),
    likes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_title (title),
    INDEX idx_created_by (created_by)
);

-- Create comments table (generic for all content types)
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL,
    content_id INT NOT NULL,
    comment TEXT NOT NULL,
    author VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_content (content_type, content_id),
    INDEX idx_author (author)
);

-- Add created_by column to posts if it doesn't exist
ALTER TABLE posts ADD COLUMN IF NOT EXISTS created_by VARCHAR(255);
ALTER TABLE posts ADD INDEX IF NOT EXISTS idx_created_by (created_by);

-- Create a default admin user (password: admin123)
INSERT IGNORE INTO users (username, password, email, role) VALUES 
('admin', 'admin123', 'admin@featherpress.com', 'admin'),
('demo', 'demo123', 'demo@featherpress.com', 'user');

-- Insert sample quotes
INSERT IGNORE INTO quotes (text, author, created_by) VALUES 
('The only way to do great work is to love what you do.', 'Steve Jobs', 'admin'),
('Innovation distinguishes between a leader and a follower.', 'Steve Jobs', 'admin');

-- Show all tables
SHOW TABLES;
