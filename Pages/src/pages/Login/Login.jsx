import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import CryptoJS from 'crypto-js'; // Importing crypto-js
import ProjectLogo from "../../assets/Images/ProjectLogo.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const secretKey = "qwertyuiopasdfghjklzxcvbnm"; // Replace this with a better secret key (e.g., environment variable)

  // Function to encrypt data
  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  };

  // Function to decrypt data
  const decryptData = (encryptedData) => {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });
  
      const { role, token } = response.data.user;
      const userData = { email, role, token }; // Save the user data along with the token
  
      // Encrypt the user data and store it in localStorage
      const encryptedUserData = encryptData(userData);
      const encryptedRoleData = encryptData({ role });
      const encryptedTokenData = encryptData({ token });
  
      localStorage.setItem('user', encryptedUserData);
      localStorage.setItem('role', encryptedRoleData);
      localStorage.setItem('token', encryptedTokenData);
  
      // Show success toast
      toast.success("Login successful!");
  
      // Redirect based on user role
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
          toast.error("Invalid role or login failed.");
          break;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      // Send the ID token to your backend
      const response = await axios.post('http://localhost:4000/api/google-login', {
        credential: credentialResponse.credential
      });
      
      console.log("Google login response:", response.data);
      const { role, token, email } = response.data.user;
      
      // Encrypt the user data and store it in localStorage
      const encryptedUserData = encryptData({ email, role, token });
      const encryptedRoleData = encryptData({ role });
      const encryptedTokenData = encryptData({ token });
      
      localStorage.setItem('user', encryptedUserData);
      localStorage.setItem('role', encryptedRoleData);
      localStorage.setItem('token', encryptedTokenData);
      
      toast.success("Google login successful!");
      
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
          toast.error("Invalid role or login failed.");
          break;
      }
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    toast.error("Google sign-in was cancelled or failed.");
  };

  return (
    <GoogleOAuthProvider clientId="275309862189-naca865pd0dri3lh5h76ng3m2m6vqh4q.apps.googleusercontent.com">
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
            
            <div className="relative flex items-center justify-center w-full mt-4">
              <div className="border-t border-gray-300 w-full"></div>
              <div className="text-center text-gray-500 text-sm bg-white px-2 absolute">OR</div>
            </div>
            
            <div className="flex justify-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
                shape="rectangular"
                logo_alignment="center"
                width="100%"
              />
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginPage;
