const express = require("express");
const mysql = require("mysql2/promise"); // Using the promise version for async/await
const cors = require("cors");
const config = require('./src/config/config.js').development;
const fs = require("fs");
const { OAuth2Client } = require('google-auth-library');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Create a connection pool for better performance
const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});
// Google OAuth client
const client = new OAuth2Client('275309862189-naca865pd0dri3lh5h76ng3m2m6vqh4q.apps.googleusercontent.com');

// Function to insert or update Google user
async function upsertGoogleUser(payload) {
  const { sub, email, email_verified, name, given_name, family_name, picture } = payload;
  
  try {
    const connection = await pool.getConnection();
    
    // Check if user exists
    const [existingUsers] = await connection.query(
      'SELECT * FROM google_users WHERE google_id = ?',
      [sub]
    );
    
    let user;
    
    if (existingUsers.length > 0) {
      // Update existing user
      await connection.query(
        `UPDATE google_users 
         SET email = ?, email_verified = ?, name = ?, given_name = ?, 
             family_name = ?, picture_url = ?, last_login = CURRENT_TIMESTAMP 
         WHERE google_id = ?`,
        [email, email_verified ? 1 : 0, name, given_name, family_name, picture, sub]
      );
      
      // Get the updated user
      const [updatedUsers] = await connection.query(
        'SELECT * FROM google_users WHERE google_id = ?',
        [sub]
      );
      user = updatedUsers[0];
    } else {
      // Insert new user
      await connection.query(
        `INSERT INTO google_users 
         (google_id, email, email_verified, name, given_name, family_name, picture_url) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [sub, email, email_verified ? 1 : 0, name, given_name, family_name, picture]
      );
      
      // Get the newly created user
      const [newUsers] = await connection.query(
        'SELECT * FROM google_users WHERE google_id = ?',
        [sub]
      );
      user = newUsers[0];
    }
    
    connection.release();
    return user;
  } catch (error) {
    console.error('Error upserting Google user:', error);
    throw error;
  }
}

// Google login route
app.post('/api/google-login', async (req, res) => {
  console.log('Received Google login request:', req.body);
  try {
    const { credential } = req.body;
    
    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: '275309862189-naca865pd0dri3lh5h76ng3m2m6vqh4q.apps.googleusercontent.com',
    });
    
    const payload = ticket.getPayload();
    console.log('Google payload:', payload);
    
    // Save or update user in database
    const user = await upsertGoogleUser(payload);
    
    // Return user data
    return res.status(200).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    return res.status(401).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
});

// Problem Raiser API
app.get('/api/problem_raiser', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM problem_raiser');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/problem_raiser', async (req, res) => {
  const { category, problem_tilte, description, media_upload, question1, question2, question3, question4, question5, created_at, created_by } = req.body;
  try {
    const [results] = await pool.query('INSERT INTO problem_raiser (category, problem_tilte, description, media_upload, question1, question2, question3, question4, question5, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [category, problem_tilte, description, media_upload, question1, question2, question3, question4, question5, created_at, created_by]);
    res.status(201).json({ message: 'Problem Raiser added successfully', id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Superviser API
app.get('/api/superviser', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM superviser');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/superviser', async (req, res) => {
  const { category, problem_tilte, description, media_upload, question1, question2, question3, question4, question5, problem_severity, status, Remarks, updated_at, updated_by } = req.body;
  try {
    const [results] = await pool.query('INSERT INTO superviser (category, problem_tilte, description, media_upload, question1, question2, question3, question4, question5, problem_severity, status, Remarks, updated_at, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [category, problem_tilte, description, media_upload, question1, question2, question3, question4, question5, problem_severity, status, Remarks, updated_at, updated_by]);
    res.status(201).json({ message: 'Superviser added successfully', id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PR Bank API
app.get('/api/pr_bank', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM pr_bank');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pr_bank', async (req, res) => {
  const { category, problem_tilte, description, media_upload, question1, question2, question3, question4, question5, problem_severity, status, Remarks, Deadline, rp, assign_to, assign_by, maintainance, created_at, created_by, updated_at, updated_by } = req.body;
  try {
    const [results] = await pool.query('INSERT INTO pr_bank (category, problem_tilte, description, media_upload, question1, question2, question3, question4, question5, problem_severity, status, Remarks, Deadline, rp, assign_to, assign_by, maintainance, created_at, created_by, updated_at, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
    [category, problem_tilte, description, media_upload, question1, question2, question3, question4, question5, problem_severity, status, Remarks, Deadline, rp, assign_to, assign_by, maintainance, created_at, created_by, updated_at, updated_by]);
    res.status(201).json({ message: 'PR Bank added successfully', id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Master Maintain API
app.get('/api/master_maintain', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM master_maintain');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/master_maintain', async (req, res) => {
  const { name, email, created_on, created_by, status } = req.body;
  try {
    const [results] = await pool.query('INSERT INTO master_maintain (name, email, created_on, created_by, status) VALUES (?, ?, ?, ?, ?)', 
    [name, email, created_on, created_by, status]);
    res.status(201).json({ message: 'Master Maintain added successfully', id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Master Login API
app.get('/api/master_login', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM master_login');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/master_login', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const [results] = await pool.query('INSERT INTO master_login (name, email, role) VALUES (?, ?, ?)', 
    [name, email, role]);
    res.status(201).json({ message: 'Master Login added successfully', id: results.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Questions API
app.get('/api/questions', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM questions');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

