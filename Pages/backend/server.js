const express = require("express");
const mysql = require("mysql2/promise"); // Using the promise version for async/await
const cors = require("cors");
const config = require('./src/config/config.js').development;
const fs = require("fs");
const { OAuth2Client } = require('google-auth-library');
const multer = require("multer");
const app = express();
const path = require("path"); // Add this line

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middleware to handle x-www-form-urlencoded data
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

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

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
}).array("Media_Upload", 5); // Allow up to 5 files

// Check file type function
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|pdf/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images and PDFs only!");
  }
}

// Google OAuth client
const client = new OAuth2Client('906508649487-ckk01v3bum6v3o9imbj4r8pkng6sj6bg.apps.googleusercontent.com');

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
      audience: '906508649487-ckk01v3bum6v3o9imbj4r8pkng6sj6bg.apps.googleusercontent.com',
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
        res.status(200).json({ message: "Login successful", user: { userId: user.user_id, name: user.name, email: user.email, role: user.role } });
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

app.post("/api/master_problem", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err);
      return res.status(400).json({ error: err.message });
    }

    const {
      Category,
      problem_title,
      Description,
      Questions_1,
      Questions_2,
      Questions_3,
      Questions_4,
      Questions_5,
      created_by,
    } = req.body;

    // Validate input data
    if (!Category || !problem_title || !Description || !Questions_1 || !Questions_2 || !Questions_3 || !Questions_4 || !Questions_5 || !created_by) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Generate file links
    const mediaUploads = req.files
      .map((file) => `http://localhost:4000/uploads/${file.filename}`)
      .join(",");

    // Insert into database
    const query = `
      INSERT INTO master_problem 
      (Category, problem_title, Description, Media_Upload, Questions_1, Questions_2, Questions_3, Questions_4, Questions_5, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    try {
      // Get a connection from the pool
      const connection = await pool.getConnection();
      
      // Execute the query
      await connection.query(query, [
        Category,
        problem_title,
        Description,
        mediaUploads,
        Questions_1,
        Questions_2,
        Questions_3,
        Questions_4,
        Questions_5,
        created_by,
      ]);

      // Release the connection back to the pool
      connection.release();
      
      res.status(201).json({ message: "Problem submitted successfully" });
    } catch (error) {
      console.error("Database error:", error);
      res.status(500).json({ error: "Failed to insert problem data" });
    }
  });
});
app.get("/api/master_problem", async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();

    // Query to fetch all problems from the database
    const query = `
      SELECT * FROM master_problem
    `;

    // Execute the query
    const [results] = await connection.query(query);

    // Release the connection back to the pool
    connection.release();

    // Format the results (e.g., split Media_Upload into an array of links)
    const formattedResults = results.map((problem) => ({
      ...problem,
      Media_Upload: problem.Media_Upload ? problem.Media_Upload.split(",") : [], // Convert comma-separated links to an array
    }));

    // Send the response
    res.status(200).json({ data: formattedResults });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Failed to fetch problem data" });
  }
});

// Server test route
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.post('/api/master_superviser', (req, res) => {
  const {
    Category,
    problem_title,
    Description,
    Media_Upload,
    Questions_1,
    Questions_2,
    Questions_3,
    Questions_4,
    Questions_5,
    status,
    Remarks,
    created_by
  } = req.body;

  // SQL query to insert data into the `master_superviser` table
  const query = `
    INSERT INTO master_superviser (Category, problem_title, Description, Media_Upload, 
    Questions_1, Questions_2, Questions_3, Questions_4, Questions_5, status, Remarks, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  // Execute the query
  db.execute(query, [
    Category,
    problem_title,
    Description,
    Media_Upload,
    Questions_1,
    Questions_2,
    Questions_3,
    Questions_4,
    Questions_5,
    status,
    Remarks,
    created_by
  ], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    res.status(201).json({
      message: 'Data inserted successfully',
      insertedId: result.insertId
    });
  });
});


// app.put('/api/master_problem/:id', async (req, res) => {
//   const { id } = req.params;
//   const {
//     Category,
//     problem_title,
//     Description,
//     Media_Upload,
//     Questions_1,
//     Questions_2,
//     Questions_3,
//     Questions_4,
//     Questions_5,
//     created_by,
//     status,
//     remarks
//   } = req.body;

//   // SQL query to update the record
//   const query = `
//     UPDATE master_problem 
//     SET 
//       Category = ?, 
//       problem_title = ?, 
//       Description = ?, 
//       Media_Upload = ?, 
//       Questions_1 = ?, 
//       Questions_2 = ?, 
//       Questions_3 = ?, 
//       Questions_4 = ?, 
//       Questions_5 = ?, 
//       created_by = ?, 
//       status = ?, 
//       remarks = ?
//     WHERE id = ?
//   `;

//   try {
//     // Get a connection from the pool
//     const connection = await pool.getConnection();

//     // Execute the update query
//     const [result] = await connection.query(query, [
//       Category, problem_title, Description, Media_Upload,
//       Questions_1, Questions_2, Questions_3, Questions_4, Questions_5,
//       created_by, status, remarks, id
//     ]);

//     connection.release();  // Don't forget to release the connection

//     // Check if any rows were updated
//     if (result.affectedRows === 0) {
//       return res.status(404).json({ error: 'Problem not found' });
//     }

//     res.json({ message: 'Problem updated successfully' });
//   } catch (error) {
//     console.error('Error updating problem:', error);
//     res.status(500).json({ error: 'Error updating problem', details: error.message });
//   }
// });

app.put('/api/master_problem/:id', async (req, res) => {
  const { id } = req.params;
  const { status, remarks } = req.body;

  try {
    const connection = await pool.getConnection();
    const query = `UPDATE master_problem SET status = ?, remarks = ? WHERE id = ?`;
    const [result] = await connection.query(query, [status, remarks, id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    res.json({ message: 'Problem updated successfully' });
  } catch (error) {
    console.error('Error updating problem:', error);
    res.status(500).json({ error: 'Error updating problem', details: error.message });
  }
});
app.get('/api/master_problems/:id', async (req, res) => {
  const problemId = req.params.id;
  const query = 'SELECT * FROM master_problem WHERE id = ?'; // Use the correct table name

  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(query, [problemId]);
    connection.release();

    if (results.length === 0) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    return res.status(200).json({ data: results[0] });
  } catch (err) {
    console.error('Error fetching problem details:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// API Route to Insert Data into pr_bank
app.post("/api/pr-bank", (req, res) => {
  const {
    category,
    problem_title,
    description,
    media_upload,
    question1,
    question2,
    question3,
    question4,
    question5,
    problem_severity,
    status,
    remarks,
    deadline,
    rp,
    assign_to,
    assign_by,
    maintainance,
    created_by,
    updated_by,
  } = req.body;

  const sql = `
    INSERT INTO pr_bank 
    (category, problem_title, description, media_upload, question1, question2, question3, question4, question5, 
    problem_severity, status, remarks, deadline, rp, assign_to, assign_by, maintainance, created_at, created_by, updated_at, updated_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, NOW(), ?)`;

  const values = [
    category,
    problem_title,
    description,
    media_upload,
    question1,
    question2,
    question3,
    question4,
    question5,
    problem_severity,
    status,
    remarks,
    deadline,
    rp,
    assign_to,
    assign_by,
    maintainance,
    created_by,
    updated_by,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Database insertion failed" });
    }
    res.status(201).json({ message: "Data inserted successfully", id: result.insertId });
  });
});

// Start the server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
