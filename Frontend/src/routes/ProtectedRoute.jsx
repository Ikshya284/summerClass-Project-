import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Requires an authenticated user (any role).
 * Unauthenticated visitors are sent to the Landing Page — not the Login
 * page — per the project's routing rules. The attempted location is kept
 * in state so Login can optionally return the user there afterwards.
 */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}