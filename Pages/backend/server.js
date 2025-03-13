const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const config = require('./src/config/config.js').development;
 const fs = require("fs"); // Make sure to require fs for file operations

const app = express();
app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});
// GET API to retrieve all records from master_login table
app.get("/api/login", (req, res) => {
  const query = "SELECT * FROM master_login";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(results);
  });
});
// POST API to handle login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  // Query to find the user
  const query = "SELECT * FROM master_login WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error during login: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    // Check if user exists
    if (results.length > 0) {
      const user = results[0];
      // Assuming you have a hashed password in the database
      if (user.password === password) { // Replace this with bcrypt comparison in production
        // If login is successful, return user data or a success message
        res.status(200).json({ message: "Login successful", user: { email: user.email, role: user.role } });
      } else {
        // If password is incorrect
        res.status(401).json({ message: "Invalid email or password" });
      }
    } else {
      // If user does not exist
      res.status(401).json({ message: "Invalid email or password" });
    }
  });
});
app.get("/api/login", (req, res) => {
  const query = "SELECT * FROM master_login";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(results);
  });
});
// POST API to handle login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  // Validate input
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }
  // Query to find the user
  const query = "SELECT * FROM master_login WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error during login: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }
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
  });
});
// GET API to retrieve all records from master_problem table
app.get("/api/master_problem", (req, res) => {
  const query = "SELECT * FROM master_problem";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data: ", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(results);
  });
});
// POST API to handle adding a new problem to master_problem table
app.post("/api/master_problem", (req, res) => {
  const { Category, Problem_Title, Description, Questions, created_by } = req.body;
  // Validate input
  if (!Category || !Problem_Title || !Description || !Questions || !created_by) {
    return res.status(400).json({ message: "All fields are required." });
  }
  // Log the data being inserted
  console.log("Inserting data:", {
    Category,
    Problem_Title,
    Description,
    Questions,
    created_by,
  });
  // Insert new problem into the database
  const query = "INSERT INTO master_problem (Category, `Problem Title`, Description, Questions, created_at, created_by) VALUES (?, ?, ?, ?, NOW(), ?)";
  db.query(query, [Category, Problem_Title, Description, Questions, created_by], (err, results) => {
    if (err) {
      console.error("Error inserting data:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(201).json({ message: "Problem added successfully", id: results.insertId });
  });
});
 // GET API to retrieve all records from master_supervisor table
app.get("/api/supervisor", (req, res) => {
    const query = "SELECT * FROM master_supervisor";
    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching data: ", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(200).json(results);
    });
});
// POST API to handle adding a new supervisor problem to master_supervisor table
app.post("/api/supervisor", (req, res) => {
    const { Category, Problem_Title, Description, Media_Upload, Questions, status, created_by } = req.body;
    // Validate input
    if (!Category || !Problem_Title || !Description || !Media_Upload || !Questions || !status || !created_by) {
        return res.status(400).json({ message: "All fields are required." });
    }
    // Insert new supervisor problem into the database
    const query = "INSERT INTO master_supervisor (Category, `Problem Title`, Description, Media_Upload, Questions, status, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?)";
    db.query(query, [Category, Problem_Title, Description, Media_Upload, Questions, status, created_by], (err, results) => {
        if (err) {
            console.error("Error inserting data: ", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        res.status(201).json({ message: "Supervisor problem added successfully", id: results.insertId });
    });
});

app.get("/api/prsolving", (req, res) => {
  const query = "SELECT * FROM master_prsolving";
  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching data: ", err);
          return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json(results);
  });
});
// POST API to handle adding a new problem to master_prsolving table
app.post("/api/prsolving", (req, res) => {
  const { Category, Problem_Title, Description, Media_Upload, Questions, status_pr, deadline, created_by } = req.body;
  // Validate input
  if (!Category || !Problem_Title || !Description || !Media_Upload || !Questions || !status_pr || !deadline || !created_by) {
      return res.status(400).json({ message: "All fields are required." });
  }
  // Insert new problem into the database
  const query = "INSERT INTO master_prsolving (Category, `Problem Title`, Description, Media_Upload, Questions, status_pr, deadline, created_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?)";
  db.query(query, [Category, Problem_Title, Description, Media_Upload, Questions, status_pr, deadline, created_by], (err, results) => {
      if (err) {
          console.error("Error inserting data: ", err);
          return res.status(500).json({ error: "Internal server error" });
      }
      res.status(201).json({ message: "Problem added successfully", id: results.insertId });
  });
});

app.get("/api/maintenance", (req, res) => {
  const query = "SELECT * FROM master_problem";
  db.query(query, (err, results) => {
      if (err) {
          console.error("Error fetching data: ", err);
          return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json(results);
  });
});
// POST API to handle adding a new problem to master_problem table for maintenance
app.post("/api/maintenance", (req, res) => {
  const { Category, Problem_Title, Description, Media_Upload, Questions, created_by } = req.body;
  // Validate input
  if (!Category || !Problem_Title || !Description || !Media_Upload || !Questions || !created_by) {
      return res.status(400).json({ message: "All fields are required." });
  }
  // Insert new problem into the database
  const query = "INSERT INTO master_problem (Category, `Problem Title`, Description, Media_Upload, Questions, created_at, created_by) VALUES (?, ?, ?, ?, ?, NOW(), ?)";
  db.query(query, [Category, Problem_Title, Description, Media_Upload, Questions, created_by], (err, results) => {
      if (err) {
          console.error("Error inserting data: ", err);
          return res.status(500).json({ error: "Internal server error" });
      }
      res.status(201).json({ message: "Problem added successfully", id: results.insertId });
  });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});