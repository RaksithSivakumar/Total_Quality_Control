const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
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
// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});