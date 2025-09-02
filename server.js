// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
// Serve uploaded images
app.use('/uploads', express.static(path.join(process.cwd(), 'public', 'uploads')));

// Helpers
async function getUserRole(pool, userId, username) {
  if (!userId && !username) return null;
  try {
    if (userId) {
      const [rows] = await pool.execute('SELECT role FROM users WHERE id = ?', [userId]);
      if (rows.length) return rows[0].role;
    }
    if (username) {
      const [rows] = await pool.execute('SELECT role FROM users WHERE username = ?', [username]);
      if (rows.length) return rows[0].role;
    }
    if (!rows.length) return null;
    return null;
  } catch {
    return null;
  }
}

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

// Comments API
// List comments for a post
app.get('/api/posts/:id/comments', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC', [id]);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// Create a comment
app.post('/api/posts/:id/comments', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const { text, author } = req.body;
    if (!text) return res.status(400).json({ error: 'Comment text is required' });
    await pool.execute('INSERT INTO comments (post_id, author, text) VALUES (?, ?, ?)', [id, author || null, text]);
    const [rows] = await pool.execute('SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC', [id]);
    res.status(201).json(rows);
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({ error: 'Failed to create comment' });
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

// Photos API
// List photos (optional filter by created_by)
app.get('/api/photos', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { created_by } = req.query;
    const [rows] = created_by
      ? await pool.execute('SELECT * FROM photos WHERE created_by = ? ORDER BY created_at DESC', [created_by])
      : await pool.execute('SELECT * FROM photos ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching photos:', error);
    res.status(500).json({ error: 'Failed to fetch photos' });
  }
});

// Create photo
app.post('/api/photos', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { title, url, description, created_by, category, tags, photographer } = req.body;
    if (!title || !url) return res.status(400).json({ error: 'Title and url are required' });
    const [result] = await pool.execute(
      'INSERT INTO photos (title, url, description, created_by, category, tags, photographer) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, url, description || null, created_by || null, category || null, tags || null, photographer || null]
    );
    const [rows] = await pool.execute('SELECT * FROM photos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating photo:', error);
    res.status(500).json({ error: 'Failed to create photo' });
  }
});

// Create photo via local file (base64 data URL)
app.post('/api/photos/upload', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { title, dataUrl, description, created_by, category, tags, photographer } = req.body;
    if (!title || !dataUrl) return res.status(400).json({ error: 'Title and dataUrl are required' });

    // Parse data URL (accept any image/* mime)
    const idx = dataUrl.indexOf(',');
    if (idx === -1) return res.status(400).json({ error: 'Invalid image data' });
    const header = dataUrl.substring(0, idx); // e.g., data:image/png;base64
    const base64 = dataUrl.substring(idx + 1);
    if (!/^data:image\/[a-zA-Z0-9.+-]+;base64$/i.test(header)) {
      return res.status(400).json({ error: 'Unsupported image format' });
    }
    const mime = header.slice(5, header.indexOf(';')); // image/png
    const subtype = mime.split('/')[1].toLowerCase();
    const ext = subtype === 'jpeg' ? 'jpg' : subtype;
    const buffer = Buffer.from(base64, 'base64');

    // Ensure uploads directory
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    fs.mkdirSync(uploadsDir, { recursive: true });

    const filename = `photo_${Date.now()}.${ext}`;
    const fullPath = path.join(uploadsDir, filename);
    fs.writeFileSync(fullPath, buffer);

    const url = `/uploads/${filename}`;
    const [result] = await pool.execute(
      'INSERT INTO photos (title, url, description, created_by, category, tags, photographer) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [title, url, description || null, created_by || null, category || null, tags || null, photographer || null]
    );
    const [rows] = await pool.execute('SELECT * FROM photos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error uploading photo:', error);
    res.status(500).json({ error: 'Failed to upload photo' });
  }
});
// Delete photo (owner or admin)
app.delete('/api/photos/:id', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const { userId, username } = req.query;
    const role = await getUserRole(pool, userId, username);
    if (role === 'admin') {
      const [result] = await pool.execute('DELETE FROM photos WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Photo not found' });
      return res.json({ message: 'Photo deleted' });
    }
    if (!username) return res.status(400).json({ error: 'username is required' });
    const [rows] = await pool.execute('SELECT created_by FROM photos WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Photo not found' });
    if ((rows[0].created_by || '') !== String(username)) return res.status(403).json({ error: 'Not allowed' });
    const [result] = await pool.execute('DELETE FROM photos WHERE id = ? AND created_by = ?', [id, username]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Photo not found' });
    res.json({ message: 'Photo deleted' });
  } catch (e) {
    console.error('Delete photo failed', e);
    res.status(500).json({ error: 'Failed to delete photo' });
  }
});

// Admin-only delete photo
app.delete('/api/admin/photos/:id', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const { userId, username } = req.query;
    const role = await getUserRole(pool, userId, username);
    if (role !== 'admin' && String(username).toLowerCase() !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const [result] = await pool.execute('DELETE FROM photos WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Photo not found' });
    res.json({ message: 'Photo deleted' });
  } catch (e) {
    console.error('Admin delete photo failed', e);
    res.status(500).json({ error: 'Failed to delete photo' });
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
    const { userId, username } = req.query; // username of requester (for ownership)
    
    // If admin, allow delete of any post
    const role = await getUserRole(pool, userId, username);
    if (role === 'admin') {
      const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Post not found' });
      return res.json({ message: 'Post deleted successfully' });
    }
    
    // Non-admin: only delete own post (match by author username)
    if (!username) return res.status(400).json({ error: 'username is required' });
    const [rows] = await pool.execute('SELECT author FROM posts WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Post not found' });
    if ((rows[0].author || '') !== String(username)) {
      return res.status(403).json({ error: 'Not allowed to delete this post' });
    }
    
    const [result] = await pool.execute('DELETE FROM posts WHERE id = ? AND author = ?', [id, username]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Like a post
app.post('/api/posts/:id/like', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    await pool.execute('UPDATE posts SET likes = likes + 1 WHERE id = ?', [id]);
    const [rows] = await pool.execute('SELECT likes FROM posts WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json({ likes: rows[0].likes });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ error: 'Failed to like post' });
  }
});

// Unlike a post
app.post('/api/posts/:id/unlike', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    await pool.execute('UPDATE posts SET likes = GREATEST(likes - 1, 0) WHERE id = ?', [id]);
    const [rows] = await pool.execute('SELECT likes FROM posts WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Post not found' });
    res.json({ likes: rows[0].likes });
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ error: 'Failed to unlike post' });
  }
});

// Admin-only delete endpoints
app.delete('/api/admin/posts/:id', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const { userId, username } = req.query;
    const role = await getUserRole(pool, userId, username);
    if (role !== 'admin' && String(username).toLowerCase() !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const [result] = await pool.execute('DELETE FROM posts WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (e) {
    console.error('Admin delete post failed', e);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// Quotes delete (owner or admin)
app.delete('/api/quotes/:id', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const { userId, username } = req.query;
    const role = await getUserRole(pool, userId);
    if (role === 'admin') {
      const [result] = await pool.execute('DELETE FROM quotes WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Quote not found' });
      return res.json({ message: 'Quote deleted' });
    }
    if (!username) return res.status(400).json({ error: 'username is required' });
    const [rows] = await pool.execute('SELECT created_by FROM quotes WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Quote not found' });
    if ((rows[0].created_by || '') !== String(username)) return res.status(403).json({ error: 'Not allowed' });
    const [result] = await pool.execute('DELETE FROM quotes WHERE id = ? AND created_by = ?', [id, username]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Quote not found' });
    res.json({ message: 'Quote deleted' });
  } catch (e) {
    console.error('Delete quote failed', e);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

// Admin-only delete quote
app.delete('/api/admin/quotes/:id', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const { userId } = req.query;
    const role = await getUserRole(pool, userId);
    if (role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const [result] = await pool.execute('DELETE FROM quotes WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Quote not found' });
    res.json({ message: 'Quote deleted' });
  } catch (e) {
    console.error('Admin delete quote failed', e);
    res.status(500).json({ error: 'Failed to delete quote' });
  }
});

// Delete comment (owner or admin)
app.delete('/api/comments/:id', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const { userId, username } = req.query;
    const role = await getUserRole(pool, userId);
    if (role === 'admin') {
      const [result] = await pool.execute('DELETE FROM comments WHERE id = ?', [id]);
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Comment not found' });
      return res.json({ message: 'Comment deleted' });
    }
    if (!username) return res.status(400).json({ error: 'username is required' });
    const [rows] = await pool.execute('SELECT author FROM comments WHERE id = ?', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Comment not found' });
    if ((rows[0].author || '') !== String(username)) return res.status(403).json({ error: 'Not allowed' });
    const [result] = await pool.execute('DELETE FROM comments WHERE id = ? AND author = ?', [id, username]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Comment not found' });
    res.json({ message: 'Comment deleted' });
  } catch (e) {
    console.error('Delete comment failed', e);
    res.status(500).json({ error: 'Failed to delete comment' });
  }
});

// Admin-only delete comment
app.delete('/api/admin/comments/:id', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { id } = req.params;
    const { userId } = req.query;
    const role = await getUserRole(pool, userId);
    if (role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    const [result] = await pool.execute('DELETE FROM comments WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Comment not found' });
    res.json({ message: 'Comment deleted' });
  } catch (e) {
    console.error('Admin delete comment failed', e);
    res.status(500).json({ error: 'Failed to delete comment' });
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
