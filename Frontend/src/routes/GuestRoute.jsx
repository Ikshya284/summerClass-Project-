import { Navigate } from "react-router-dom";
import { useAuth, roleHomePath } from "../context/AuthContext";

/**
 * For pages that only make sense when logged out (Login, Register).
 * If an already-authenticated user lands here (e.g. presses "Login" while
 * signed in), send them straight to their role-based home instead.
 */
export default function GuestRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to={roleHomePath(user.role)} replace />;
  }

  return children;
}