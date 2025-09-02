// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Static uploads directory
const uploadsDir = path.resolve('public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer setup for image and video uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, `${uniqueSuffix}${ext}`);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype) || /^video\//.test(file.mimetype) || /^audio\//.test(file.mimetype)) return cb(null, true);
    cb(new Error('Only image/video/audio uploads are allowed'));
  },
  limits: { fileSize: 200 * 1024 * 1024 }
});

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
      galleries: '/api/galleries',
      videos: '/api/videos',
      audios: '/api/audios',
      health: '/api/health',
      upload: '/api/upload',
      uploads_list: '/api/uploads'
    }
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Image/Video upload endpoint with explicit Multer error handling
app.post('/api/upload', (req, res) => {
  upload.array('files', 10)(req, res, (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    try {
      const files = (req.files || []).map((f) => ({
        filename: f.filename,
        url: `/uploads/${f.filename}`,
        mimetype: f.mimetype,
        size: f.size
      }));
      res.status(201).json({ files });
    } catch (e) {
      console.error('Upload processing error:', e);
      res.status(500).json({ error: 'Upload processing failed' });
    }
  });
});

// List uploaded files
app.get('/api/uploads', async (req, res) => {
  try {
    const dir = uploadsDir;
    const entries = await fs.promises.readdir(dir);
    const detailed = await Promise.all(entries.map(async (name) => {
      const p = path.join(dir, name);
      const st = await fs.promises.stat(p);
      return { name, url: `/uploads/${name}`, size: st.size, mtime: st.mtimeMs, isFile: st.isFile() };
    }));
    const files = detailed
      .filter((d) => d.isFile)
      .sort((a, b) => b.mtime - a.mtime);
    res.json({ files });
  } catch (err) {
    console.error('List uploads error:', err);
    res.status(500).json({ error: 'Failed to list uploads' });
  }
});

// Videos API
app.get('/api/videos', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { created_by } = req.query;
    const [rows] = created_by
      ? await pool.execute('SELECT * FROM videos WHERE created_by = ? ORDER BY created_at DESC', [created_by])
      : await pool.execute('SELECT * FROM videos ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

app.post('/api/videos', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { title, description, created_by, source, url } = req.body;
    if (!title || !source || !url) {
      return res.status(400).json({ error: 'Title, source, and url are required' });
    }
    const [result] = await pool.execute(
      'INSERT INTO videos (title, description, created_by, source, url) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, created_by || null, source, url]
    );
    const [rows] = await pool.execute('SELECT * FROM videos WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// Audios API
app.get('/api/audios', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { created_by } = req.query;
    const [rows] = created_by
      ? await pool.execute('SELECT * FROM audios WHERE created_by = ? ORDER BY created_at DESC', [created_by])
      : await pool.execute('SELECT * FROM audios ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching audios:', error);
    res.status(500).json({ error: 'Failed to fetch audios' });
  }
});

app.post('/api/audios', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { title, description, created_by, source, url } = req.body;
    if (!title || !source || !url) {
      return res.status(400).json({ error: 'Title, source, and url are required' });
    }
    const [result] = await pool.execute(
      'INSERT INTO audios (title, description, created_by, source, url) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, created_by || null, source, url]
    );
    const [rows] = await pool.execute('SELECT * FROM audios WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating audio:', error);
    res.status(500).json({ error: 'Failed to create audio' });
  }
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

// Galleries API
app.get('/api/galleries', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { created_by } = req.query;
    const [rows] = created_by
      ? await pool.execute('SELECT * FROM galleries WHERE created_by = ? ORDER BY created_at DESC', [created_by])
      : await pool.execute('SELECT * FROM galleries ORDER BY created_at DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({ error: 'Failed to fetch galleries' });
  }
});

app.post('/api/galleries', async (req, res) => {
  try {
    const { pool } = await import('./src/lib/mysqlClient.js');
    const { title, description, created_by, images } = req.body;
    if (!title || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ error: 'Title and at least one image are required' });
    }
    const imagesJson = JSON.stringify(images);
    const [result] = await pool.execute(
      'INSERT INTO galleries (title, description, created_by, images) VALUES (?, ?, ?, ?)',
      [title, description || null, created_by || null, imagesJson]
    );
    const [rows] = await pool.execute('SELECT * FROM galleries WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error creating gallery:', error);
    res.status(500).json({ error: 'Failed to create gallery' });
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
