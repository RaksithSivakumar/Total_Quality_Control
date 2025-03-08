import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login/Login"; // Ensure this file exists
import SurveyCreation from "../pages/Problemraisordashboard/surveycreation"; // Ensure this file exists
import ProblemRaisorDashboard from "../pages/Problemraisordashboard/problemraisordashboard"; // Ensure this file exists
import SupervisorDashboard from "../pages/Superviserdashboard/superviserdashboard"; // Ensure this file exists
import Problemsolver from "../pages/Problemsolvingdashboard/problemsolvingdashboard"; // Ensure this file exists

export default function Routernav() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/survey" element={<SurveyCreation />} />
      <Route path="/Problemrd" element={<ProblemRaisorDashboard />} />
      <Route path="/Superviser" element={<SupervisorDashboard />} />
      <Route path="/Problemsol" element={<Problemsolver />} />
    </Routes>
  );
}