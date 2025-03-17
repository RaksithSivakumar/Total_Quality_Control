import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import ProjectLogo from "../../assets/Images/ProjectLogo.svg";
import { EyeIcon, EyeOffIcon } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const passwordInputRef = useRef(null); // Ref to the password input field

  const handleClickShowPassword = () => {
    // Save the current cursor position
    const cursorPosition = passwordInputRef.current.selectionStart;

    // Toggle the password visibility
    setShowPassword((prevShowPassword) => !prevShowPassword);

    // After the state updates, restore the cursor position
    setTimeout(() => {
      passwordInputRef.current.setSelectionRange(cursorPosition, cursorPosition);
      passwordInputRef.current.focus(); // Ensure the input remains focused
    }, 0);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault(); // Prevent default behavior
  };

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
      toast.success("Login successful!");
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
      const response = await axios.post('http://localhost:5000/api/google-login', {
        credential: credentialResponse.credential
      });
      console.log("Google login response:", response.data);
      const { role } = response.data.user;
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
        case "problemmaintenance":
          navigate("/Maintain");
          break;
        case "problemsolver":
          navigate("/ProblemAdmin");
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
                required
              />
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-left text-sm font-medium text-gray-600">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF7622] focus:border-[#FF7622] transition-colors"
                  ref={passwordInputRef} // Attach the ref
                  required
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5" /> // Show "eye off" icon when password is visible
                    ) : (
                      <EyeIcon className="w-5 h-5" /> // Show "eye" icon when password is hidden
                    )}
                  </button>
                </div>
              </div>
            </div>
            <button
              type="submit"
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