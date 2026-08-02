import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ROLES } from "../context/AuthContext";

/**
 * Requires an authenticated user with the Admin role.
 * - Not logged in at all -> Landing Page.
 * - Logged in but not an admin -> User Home (never shown the admin UI).
 */
export default function AdminRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (user.role !== ROLES.ADMIN) {
    return <Navigate to="/home" replace />;
  }

  return children;
}