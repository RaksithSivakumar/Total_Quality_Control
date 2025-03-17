import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "../pages/Login/Login";
import SurveyCreation from "../pages/Problemraisordashboard/surveycreation";
import ProblemRaisorDashboard from "../pages/Problemraisordashboard/problemraisordashboard";
import SupervisorDashboard from "../pages/Superviserdashboard/superviserdashboard";
import Problemsolver from "../pages/Problemsolvingdashboard/problemsolvingdashboard";
import Maintainanceteam from "../pages/Maintainanceteam/maintainanceteam";
import ProblemAdmin from "../pages/ProblemAdmin/ProblemAdmin";
import CryptoJS from "crypto-js";

const secretKey = "qwertyuiopasdfghjklzxcvbnm"; 

const getUserRole = () => {
  const encryptedUser = localStorage.getItem("user");
  if (!encryptedUser) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedUser, secretKey);
    const user = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return user?.role || null;
  } catch {
    return null;
  }
};

const PrivateRoute = ({ children, allowedRoles }) => {
  const userRole = getUserRole();
  return allowedRoles.includes(userRole) ? children : <Navigate to="/login" />;
};

export default function Routernav() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/survey" element={<PrivateRoute allowedRoles={["student"]}><SurveyCreation /></PrivateRoute>} />
      <Route path="/Problemrd" element={<PrivateRoute allowedRoles={["student"]}><ProblemRaisorDashboard /></PrivateRoute>} />
      <Route path="/Superviser" element={<PrivateRoute allowedRoles={["supervisor"]}><SupervisorDashboard /></PrivateRoute>} />
      <Route path="/Problemsol" element={<PrivateRoute allowedRoles={["problem"]}><Problemsolver /></PrivateRoute>} />
      <Route path="/Maintain" element={<PrivateRoute allowedRoles={["problemmaintenance"]}><Maintainanceteam /></PrivateRoute>} />
      <Route path="/ProblemAdmin" element={<PrivateRoute allowedRoles={["problemsolver"]}><ProblemAdmin /></PrivateRoute>} />
    </Routes>
  );
}
