import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProjectLogo from "../../assets/Images/ProjectLogo.svg";
import GoogleLogo from "../../assets/Images/google.png"; // Import the Google logo

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });
      console.log("Response data:", response.data);
      const { role } = response.data.user;
      switch (role) {
        case "student":
          navigate("/Problemrd");
          break;
        case "supervisor":
          navigate("/Superviser");
          break;
        case "problem":
          navigate("/Problemsol");
          break;
        case "maintainanace":
          navigate("/Maintain");
          break;
        default:
          alert("Invalid role or login failed.");
          break;
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGooglesignin = () => {
    // Google sign-in logic here
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md">
        <div className="text-center">
          <img
            src={ProjectLogo}
            alt="Total Quality Circle"
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
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          <button
            type="button"
            onClick={handleGooglesignin}
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center justify-center mr-3">
              <img src={GoogleLogo} alt="Google Logo" className="w-5 h-5" />
            </div>
            <span className="text-gray-600 text-sm font-medium">
              Sign in with Google
            </span>
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default LoginPage;