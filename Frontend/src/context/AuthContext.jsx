import { createContext, useContext, useEffect, useState } from "react";
import { isValidEmail, validatePasswordStrong } from "../utils/validators";
import { generateId } from "../utils/id";
import { logActivity } from "../services/activityService";
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
} from "../firebase/firebaseConfig";
import {
  signInWithRedirect,
  getRedirectResult,
  signOut as firebaseSignOut,
} from "firebase/auth";
import api, { setAuthToken, getAuthToken } from "../services/api";

/**
 * Authentication context — backed by the Express API with JWT.
 *
 * Email/password and Google sign-in both receive a JWT from the backend.
 * The token is kept in memory (via setAuthToken) and sessionStorage so a
 * page refresh restores the session without using localStorage.
 *
 * Google authentication is handled by Firebase.
 * After Firebase authenticates the user, their email/name is sent to
 * the Express backend, which returns the application's JWT.
 *
 * Password reset remains a local-only demo flow.
 */

const AuthContext = createContext(null);

const TOKEN_KEY = "cookcraft_jwt";
const USER_KEY = "cookcraft_user";

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

function readSessionUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistSession(user, token) {
  setAuthToken(token);
  sessionStorage.setItem(TOKEN_KEY, token);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  setAuthToken(null);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function roleHomePath(role) {
  return role === ROLES.ADMIN ? "/admin/dashboard" : "/home";
}

export async function countRegisteredUsers() {
  return 0;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
   * Restore existing JWT session AND handle Firebase Google redirect.
   */
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const token = sessionStorage.getItem(TOKEN_KEY);
      const savedUser = readSessionUser();

      /*
       * First check whether the user has just returned from
       * Firebase Google authentication.
       */
      if (isFirebaseConfigured) {
        try {
          const result = await getRedirectResult(auth);

          if (result) {
            const googleUser = result.user;

            const email = googleUser.email;
            const name =
              googleUser.displayName ||
              email?.split("@")[0] ||
              "Google User";

            /*
             * Send Google user information to your Express backend.
             * The backend should return your application's JWT.
             */
            const { data } = await api.post("/auth/google", {
              email,
              name,
            });

            if (!cancelled) {
              persistSession(data.user, data.token);
              setUser(data.user);

              logActivity({
                type: "auth",
                action: "login",
                message: `${data.user.name} logged in with Google`,
              });
            }

            if (!cancelled) {
              setLoading(false);
            }

            return;
          }
        } catch (error) {
          console.error("Google redirect authentication failed:", error);

          if (!cancelled) {
            setLoading(false);
          }

          return;
        }
      }

      /*
       * No Google redirect result.
       * Now restore the normal JWT session.
       */
      if (!token) {
        if (!cancelled) {
          setLoading(false);
        }
        return;
      }

      setAuthToken(token);

      try {
        const { data } = await api.get("/auth/me");

        if (!cancelled) {
          setUser(data.user);
          sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
        }
      } catch (error) {
        console.error("Session restoration failed:", error);

        if (savedUser && !cancelled) {
          setUser(savedUser);
        } else {
          clearSession();
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * Normal email/password login.
   */
  async function login(email, password) {
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });

      persistSession(data.user, data.token);
      setUser(data.user);

      return data.user;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Normal email/password registration.
   */
  async function register({ name, email, password }) {
    try {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      persistSession(data.user, data.token);
      setUser(data.user);

      return data.user;
    } catch (error) {
      throw error;
    }
  }

  /*
   * Logout.
   */
  function logout() {
    clearSession();
    setUser(null);

    if (isFirebaseConfigured && auth?.currentUser) {
      firebaseSignOut(auth).catch(() => {});
    }
  }

  /*
   * Google login.
   *
   * We use redirect instead of popup.
   * This avoids the popup/window.close issue that can occur
   * on some browsers and computers.
   *
   * Firebase will redirect the browser to Google.
   * After authentication, Firebase redirects back to this site.
   * getRedirectResult() above then handles the result.
   */
  async function loginWithGoogle() {
    if (!isFirebaseConfigured) {
      throw new Error(
        "Google Sign-In isn't configured yet. Add your Firebase credentials to a .env file."
      );
    }

    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err) {
      console.error("Google sign-in redirect error:", err);

      throw new Error(
        err?.message || "Google sign-in failed. Please try again."
      );
    }
  }

  /*
   * Password reset.
   */
  async function requestPasswordReset(email) {
    const trimmedEmail = String(email || "").trim();

    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      throw new Error("Enter a valid email address.");
    }

    logActivity({
      type: "auth",
      action: "update",
      message: `Password reset requested for ${trimmedEmail}`,
    });

    return generateId("reset");
  }

  /*
   * Reset password.
   */
  async function resetPassword(token, newPassword) {
    if (!token) {
      throw new Error("Reset link is invalid or missing.");
    }

    const passwordError = validatePasswordStrong(newPassword);

    if (passwordError) {
      throw new Error(passwordError);
    }

    throw new Error(
      "Password reset via email is not available yet. Contact an administrator."
    );
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === ROLES.ADMIN,
    token: getAuthToken(),

    login,
    register,
    logout,
    loginWithGoogle,

    isGoogleAuthAvailable: isFirebaseConfigured,

    requestPasswordReset,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return ctx;
}