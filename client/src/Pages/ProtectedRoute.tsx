import React from "react";
import { useAuth } from "@/store/Auth/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import SpinnerFullPage from "@/Components/UI/SpinnerFullPage";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <SpinnerFullPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (requiredRole && user?.role !== requiredRole) {
    if (user?.role === "admin") return <Navigate to="/admin-dashboard" replace />;
    if (user?.role === "provider") return <Navigate to="/provider-dashboard" replace />;
    return <Navigate to="/bookings" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
