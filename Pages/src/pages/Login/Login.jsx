import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import CryptoJS from "crypto-js";
import ProjectLogo from "../../assets/Images/ProjectLogo.svg";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const secretKey = "qwertyuiopasdfghjklzxcvbnm";

  const encryptData = (data) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      });
      const { userId, name, role, token } = response.data.user;

      const userData = { userId, name, email, role, token };

      localStorage.setItem("user", encryptData(userData));

      toast.success("Login successful!");

      navigate(roleBasedRedirect(role));
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:4000/api/google-login",
        {
          credential: credentialResponse.credential,
        }
      );

      const { userId, name, email, role, token } = response.data.user;

      localStorage.setItem(
        "user",
        encryptData({ userId, name, email, role, token })
      );

      toast.success("Google login successful!");

      navigate(roleBasedRedirect(role));
    } catch (error) {
      toast.error("Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const roleBasedRedirect = (role) => {
    const routes = {
      student: "/Problemrd",
      supervisor: "/Superviser",
      problem: "/Problemsol",
      problemmaintenance: "/Maintain",
      problemsolver: "/ProblemAdmin",
    };
    return routes[role] || "/";
  };

  return (
    <GoogleOAuthProvider clientId="906508649487-ckk01v3bum6v3o9imbj4r8pkng6sj6bg.apps.googleusercontent.com">
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 w-full max-w-md">
          <div className="text-center">
            <img
              src={ProjectLogo}
              alt="Total Quality Circle"
              className="w-20 mx-auto mb-6"
            />
            <h2 className="text-2xl font-semibold text-[#616161] mb-2">
              Total Quality Circle
            </h2>
            <p className="text-[#ff9800] mb-6">Please log in to continue</p>
          </div>
          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="flex flex-col space-y-1">
              <label className="text-left text-sm font-bold text-gray-600">
                Email
              </label>
              <input
                type="email"
                placeholder="tqc@bitsathy.ac.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-gray-600 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF7622] focus:border-[#FF7622] transition-colors"
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-left text-sm font-bold text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-gray-600 w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#FF7622] focus:border-[#FF7622] transition-colors"
              />
            </div>
            <button
              className="font-bold w-full px-3 py-2 bg-[#FF7622] rounded-md text-white"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="relative flex items-center justify-center w-full mt-4">
              <div className="border-t border-gray-300 w-full"></div>
              <div className="text-center text-gray-500 text-sm bg-white px-2 absolute">
                OR
              </div>
            </div>

            <div className="flex justify-center mt-4">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google sign-in failed.")}
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
