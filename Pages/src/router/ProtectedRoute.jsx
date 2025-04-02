import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles }) => {
  // Check if the user is authenticated and has the correct role
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("role");

  if (!isAuthenticated || !allowedRoles.includes(userRole)) {
    // If not authenticated or role doesn't match, redirect to login
    return <Navigate to="/" replace />;
  }

  // If authenticated and role matches, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;