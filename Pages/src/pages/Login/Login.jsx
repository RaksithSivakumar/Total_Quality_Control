import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
const LoginPage = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
  // Password validation
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };
  // Toggle between login and registration forms
  const handleToggle = () => {
    setIsRegistering(!isRegistering);
    setError(""); // Clear any previous errors
    setSuccess(""); // Clear any previous success messages
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Validate all fields
    if (!email || !password) {
      setError("All fields are required.");
      return;
    }
    // API endpoint
    const endpoint = "http://localhost:5000/api/login"; // Add your API endpoint here
    const payload = { email, password }; // Create payload for the request
    try {
      // Send API request using axios
      const response = await axios.post(endpoint, payload);
      if (response.status === 200) {
        setSuccess("Login successful!");
        // Get the role from the response
        const userRole = response.data.user.role; // Assuming the backend sends the role
        // Redirect based on role
        switch (userRole.toLowerCase()) {
          case "student":
            navigate("/Problemrd");
            break;
          case "supervisor":
            navigate("/Superviser");
            break;
          case "problem_solving_team":
            navigate("/Problemsol");
            break;
          case "maintainance":
            navigate("/Maintain");
            break;
          default:
            setError("Invalid role.");
            break;
        }
      }
    } catch (err) {
      // Handle errors
      if (err.response) {
        setError(err.response.data.message || "An error occurred.");
      } else {
        setError("Network error. Please try again.");
      }
    }
  };
  return (
    <div className="flex justify-center items-center h-screen bg-amber-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-center text-amber-500 text-2xl font-bold mb-6">
          {isRegistering ? "Register" : "Login"}
        </h2>
        {/* Error and Success Messages */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
            />
          </div>
          {/* Password Field */}
          <div>
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
            />
          </div>
          {/* Role Field (optional, uncomment if needed) */}
          {/* <div>
            <label className="block mb-2 font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-300 focus:border-transparent"
            >
              <option value="Student">Student</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Problem Solving Team">Problem Solving Team</option>
              <option value="Maintainance">Maintainance</option>
            </select>
          </div> */}
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-3 bg-amber-500 text-white border-none rounded cursor-pointer text-base font-medium hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-300 focus:ring-offset-2"
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>
        {/* Toggle between Login and Register */}
        <p className="text-center mt-6">
          {isRegistering ? "Already have an account? " : "New user? "}
          <button
            onClick={handleToggle}
            className="text-amber-500 font-bold hover:text-amber-600 focus:outline-none"
            type="button"
          >
            {isRegistering ? "Login here" : "Register here"}
          </button>
        </p>
      </div>
    </div>
  );
};
export default LoginPage;