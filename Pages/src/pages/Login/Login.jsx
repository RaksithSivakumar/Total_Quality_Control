import React, { useState } from "react";
import { Google } from "@mui/icons-material";
import ProjectLogo from "../../../public/ProjectLogo.svg";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import axios from "axios"; // Import axios for making HTTP requests
const LoginPage = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate(); // Initialize useNavigate for navigation
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true); // Set loading state to true
    try {
      // Send POST request to backend with email and password
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      // Log the response data for debugging
      console.log("Response data:", response.data);
      // Extract the role from the response data
      const { role } = response.data.user; // Assuming the API response contains the user object with role
      // Navigate based on the user's role
      switch (role) {
        case "student":
          navigate("/Problemrd"); // Navigate to student page
          break;
        case "supervisor":
          navigate("/Superviser"); // Navigate to supervisor page
          break;
        case "problem":
          navigate("/Problemsol"); // Navigate to problem-solving team page
          break;
        case "maintainanace":
          navigate("/Maintain"); // Navigate to maintenance page
          break;
        default:
          alert("Invalid role or login failed."); // Handle unexpected roles
          break;
      }
    } catch (error) {
      console.error("Login error:", error); // Log the error for debugging
      alert("Login failed. Please check your credentials."); // Alert the user of the failure
    } finally {
      setLoading(false); // Reset loading state
    }
  };
  const handleGooglesignin = () => {
    // Google sign-in logic here (not implemented in this example)
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md">
        <div className="text-center">
          <img
            src={ProjectLogo}
            alt="Bitlinks"
            className="w-20 mx-auto mb-6"
          />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Total Quality Circle
          </h2>
          <p className="text-gray-500 mb-6">Please log in to continue</p>
        </div>
        <form className="space-y-4" onSubmit={handleLogin}>
          <div className="flex flex-col space-y-1">
            <label className="text-left text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="tqc@bitsathy.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7622] focus:border-[#FF7622] transition-colors"
            />
          </div>
          <div className="flex flex-col space-y-1">
            <label className="text-left text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7622] focus:border-[#FF7622] transition-colors"
            />
          </div>
          <button
            className="w-full px-3 py-2 border border-transparent bg-[#FF7622] rounded-md focus:outline-none transition-colors text-white"
            disabled={loading} // Disable button while loading
          >
            {loading ? "Logging in..." : "Login"} 
          </button>
          <button
            type="button"
            onClick={handleGooglesignin}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-center mr-3">
              <Google className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-gray-600 text-sm font-medium">
              Sign in with Google
            </span>
          </button>
        </form>
      </div>
    </div>
  );
};
export default LoginPage;