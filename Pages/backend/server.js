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

// Regular login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  
  try {
    // Query to find the user
    const [results] = await pool.query("SELECT * FROM master_login WHERE email = ?", [email]);
    
    // Check if user exists
    if (results.length > 0) {
      const user = results[0];
      // Assuming you have a hashed password in the database
      if (user.password === password) { // Replace this with bcrypt comparison in production
        res.status(200).json({ message: "Login successful", user: { email: user.email, role: user.role } });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    console.error("Error during login: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET API to retrieve all records from master_login table
app.get("/api/login", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM master_login");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching data: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET API to retrieve all records from master_problem table
app.get("/api/master_problem", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM master_problem");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching data: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST API to handle adding a new problem to master_problem table
app.post("/api/master_problem", async (req, res) => {
  const { Category, Problem_Title, Description, Questions, created_by } = req.body;
  
  // Validate input
  if (!Category || !Problem_Title || !Description || !Questions || !created_by) {
    return res.status(400).json({ message: "All fields are required." });
  }
  
  try {
    // Insert new problem into the database
    const [result] = await pool.query(
      "INSERT INTO master_problem (Category, `Problem Title`, Description, Questions, created_at, created_by) VALUES (?, ?, ?, ?, NOW(), ?)",
      [Category, Problem_Title, Description, Questions, created_by]
    );
    
    res.status(201).json({ message: "Problem added successfully", id: result.insertId });
  } catch (err) {
    console.error("Error inserting data:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET API to retrieve all records from master_supervisor table
app.get("/api/supervisor", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM master_supervisor");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching data: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST API to handle adding a new supervisor problem to master_supervisor table
app.post("/api/supervisor", async (req, res) => {
  const { Category, Problem_Title, Description, Media_Upload, Questions, status, created_by } = req.body;
  
  // Validate input
  if (!Category || !Problem_Title || !Description || !Media_Upload || !Questions || !status || !created_by) {
    return res.status(400).json({ message: "All fields are required." });
  }
  
  try {
    // Insert new supervisor problem into the database
    const [result] = await pool.query(
      "INSERT INTO master_supervisor (Category, `Problem Title`, Description, Media_Upload, Questions, status, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)",
      [Category, Problem_Title, Description, Media_Upload, Questions, status, created_by]
    );
    
    res.status(201).json({ message: "Supervisor problem added successfully", id: result.insertId });
  } catch (err) {
    console.error("Error inserting data: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/prsolving", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM master_prsolving");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching data: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST API to handle adding a new problem to master_prsolving table
app.post("/api/prsolving", async (req, res) => {
  const { Category, Problem_Title, Description, Media_Upload, Questions, status_pr, deadline, created_by } = req.body;
  
  // Validate input
  if (!Category || !Problem_Title || !Description || !Media_Upload || !Questions || !status_pr || !deadline || !created_by) {
    return res.status(400).json({ message: "All fields are required." });
  }
  
  try {
    // Insert new problem into the database
    const [result] = await pool.query(
      "INSERT INTO master_prsolving (Category, `Problem Title`, Description, Media_Upload, Questions, status_pr, deadline, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)",
      [Category, Problem_Title, Description, Media_Upload, Questions, status_pr, deadline, created_by]
    );
    
    res.status(201).json({ message: "Problem added successfully", id: result.insertId });
  } catch (err) {
    console.error("Error inserting data: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/api/maintenance", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM master_problem");
    res.status(200).json(results);
  } catch (err) {
    console.error("Error fetching data: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// POST API to handle adding a new problem to master_problem table for maintenance
app.post("/api/maintenance", async (req, res) => {
  const { Category, Problem_Title, Description, Media_Upload, Questions, created_by } = req.body;
  
  // Validate input
  if (!Category || !Problem_Title || !Description || !Media_Upload || !Questions || !created_by) {
    return res.status(400).json({ message: "All fields are required." });
  }
  
  try {
    // Insert new problem into the database
    const [result] = await pool.query(
      "INSERT INTO master_problem (Category, `Problem Title`, Description, Media_Upload, Questions, created_at, created_by) VALUES (?, ?, ?, ?, ?, NOW(), ?)",
      [Category, Problem_Title, Description, Media_Upload, Questions, created_by]
    );
    
    res.status(201).json({ message: "Problem added successfully", id: result.insertId });
  } catch (err) {
    console.error("Error inserting data: ", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});