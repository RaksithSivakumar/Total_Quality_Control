const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require('./src/config/config.js').development;

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});
app.post("/register", (req, res) => {
    const { email, password, role } = req.body;
    const query = "INSERT INTO users (email_id, passwords, Roles) VALUES (?, ?, ?)";
    db.query(query, [email, password, role], (err, result) => {
      if (err) {
        return res.status(400).json({ message: "Registration failed. Email may already exist." });
      }
      res.status(201).json({ message: "Registration successful!" });
    });
  });
  
  // Login endpoint
  app.post("/login", (req, res) => {
    const { email, password, role } = req.body;
    const query = "SELECT * FROM users WHERE email_id = ? AND passwords = ? AND Roles = ?";
    db.query(query, [email, password, role], (err, results) => {
      if (err || results.length === 0) {
        return res.status(401).json({ message: "Invalid credentials." });
      }
      res.status(200).json({ message: "Login successful!" });
    });
  });
  
  // Start server
  const PORT = 5000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });