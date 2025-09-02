// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection on startup
app.use(async (req, res, next) => {
  try {
    const { testConnection } = await import('./src/lib/mysqlClient.js');
    await testConnection();
    next();
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// Quotes API
// List quotes (optional filter by created_by)
app.get('/api/quotes', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { created_by } = req.query;
    const [rows] = created_by
      ? await pool.execute('SELECT * FROM quotes WHERE created_by = ? ORDER BY created_at DESC', [created_by])
      : await pool.execute('SELECT * FROM quotes ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Failed to fetch quotes' });
  }
});

// Create quote
app.post('/api/quotes', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { text, author, created_by, category, tags } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Quote text is required' });
    }
    const [result] = await pool.execute(
      'INSERT INTO quotes (text, author, created_by, category, tags) VALUES (?, ?, ?, ?, ?)',
      [text, author || null, created_by || null, category || null, tags || null]
    );
    const [rows] = await pool.execute('SELECT * FROM quotes WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ error: 'Failed to create quote' });
  }
});

// Routes

// Get all posts
app.get('/api/posts', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { author } = req.query;
    if (author) {
      console.log('[GET /api/posts] Filtering by author:', author);
    }
    const [rows] = author
      ? await pool.execute('SELECT * FROM posts WHERE author = ? ORDER BY created_at DESC', [author])
      : await pool.execute('SELECT * FROM posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Get single post by ID
app.get('/api/posts/:id', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM posts WHERE id = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// Create new post
app.post('/api/posts', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { title, content, image_url, author } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const [result] = await pool.execute(
      'INSERT INTO posts (title, content, author, image_url) VALUES (?, ?, ?, ?)',
      [title, content, author || null, image_url || null]
    );
    
    const [newPost] = await pool.execute('SELECT * FROM posts WHERE id = ?', [result.insertId]);
    res.status(201).json(newPost[0]);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Update post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const { title, content, image_url } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    
    const [result] = await pool.execute(
      'UPDATE posts SET title = ?, content = ?, image_url = ? WHERE id = ?',
      [title, content, image_url || null, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    const [updatedPost] = await pool.execute('SELECT * FROM posts WHERE id = ?', [id]);
    res.json(updatedPost[0]);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// Delete post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    
    const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Danger: Delete ALL posts (development utility)
app.delete('/api/posts', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    await pool.execute('DELETE FROM posts');
    res.json({ message: 'All posts deleted' });
  } catch (error) {
    console.error('Error deleting all posts:', error);
    res.status(500).json({ error: 'Failed to delete all posts' });
  }
});

// Root API endpoint
app.get('/api', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Feather Press API is running',
    endpoints: {
      posts: '/api/posts',
      health: '/api/health'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Authentication routes

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const user = rows[0];
    delete user.password; // Don't send password back
    
    res.json({ 
      message: 'Login successful',
      user,
      token: 'dummy-token-' + Date.now() // Simple token for demo
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
    
    if (password.length < 3) {
      return res.status(400).json({ error: 'Password must be at least 3 characters' });
    }
    
    // Check if username already exists
    const [existingUsers] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      [username]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    // Create new user
    const [result] = await pool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, password]
    );
    
    res.status(201).json({ 
      message: 'User created successfully',
      userId: result.insertId
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Start server
async function startServer() {
  try {
    // Initialize database
    const { initializeDatabase } = await import('./src/lib/mysqlClient.js');
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
