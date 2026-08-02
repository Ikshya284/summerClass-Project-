import { createContext, useContext, useEffect, useState } from "react";
import { isValidEmail, validatePasswordStrong } from "../utils/validators";
import { generateId } from "../utils/id";
import { logActivity } from "../services/activityService";
import { auth, googleProvider, isFirebaseConfigured } from "../firebase/firebaseConfig";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import api from "../services/api";
/**
 * Centralized authentication context.
 *
 * The project has no backend yet (see src/services/recipeService.js — it is
 * local-only and stubbed for a future API), so this context stands in for a
 * real auth API using localStorage:
 *
 *   - "cookcraft_users_db"      -> array of registered accounts
 *        { name, email, password: "<saltHex>:<hashHex>", role }
 *   - "cookcraft_auth_user"     -> the currently logged-in user (session)
 *   - "cookcraft_reset_tokens"  -> array of { token, email, expiresAt }
 *
 * Passwords are never stored in plain text. Each password is hashed with
 * SHA-256 salted with a random value per user (via the Web Crypto API),
 * and only the salt + hash are persisted. When a real backend/auth API
 * exists, only the functions below need to be rewired to call it — every
 * component that consumes `useAuth()` stays the same.
 */

const AuthContext = createContext(null);

const USERS_DB_KEY = "cookcraft_users_db";
const SESSION_KEY = "cookcraft_auth_user";
const RESET_TOKENS_KEY = "cookcraft_reset_tokens";
const RESET_TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

export const ROLES = {
  ADMIN: "admin",
  USER: "user",
};

// Demo seed accounts so the flow is testable without a backend.
// Plain text here only because these are the *inputs* to the hashing step
// below — they are never written to storage unhashed.
const DEFAULT_USERS_SEED = [
  { name: "Chef Admin", email: "admin@cookcraft.com", password: "admin123", role: ROLES.ADMIN },
  { name: "Jamie Cook", email: "user@cookcraft.com", password: "user123", role: ROLES.USER },
];

/* ------------------------------- Password hashing (Web Crypto) ------------------------------- */

const HASHED_PATTERN = /^[0-9a-f]{32}:[0-9a-f]{64}$/i;

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomSaltHex() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bufferToHex(bytes.buffer);
}

async function sha256Hex(text) {
  const encoded = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return bufferToHex(digest);
}

async function hashPassword(plainPassword, saltHex = randomSaltHex()) {
  const hashHex = await sha256Hex(saltHex + plainPassword);
  return `${saltHex}:${hashHex}`;
}

function isHashed(stored) {
  return typeof stored === "string" && HASHED_PATTERN.test(stored);
}

async function verifyPassword(plainPassword, storedValue) {
  if (!isHashed(storedValue)) return false;
  const [saltHex] = storedValue.split(":");
  const candidate = await hashPassword(plainPassword, saltHex);
  return candidate === storedValue;
}

/* ------------------------------- Storage helpers ------------------------------- */

function readRaw(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeRaw(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/**
 * Loads the users DB, seeding demo accounts (hashed) on first run and
 * transparently migrating any legacy plain-text password entries to the
 * hashed format so older data left in a browser's localStorage from a
 * previous version of this app is upgraded automatically.
 */
async function loadUsersDb() {
  const stored = readRaw(USERS_DB_KEY, null);

  if (!stored) {
    const seeded = await Promise.all(
      DEFAULT_USERS_SEED.map(async (u) => ({ ...u, password: await hashPassword(u.password) }))
    );
    writeRaw(USERS_DB_KEY, seeded);
    return seeded;
  }

  let migrated = false;
  const upgraded = await Promise.all(
    stored.map(async (u) => {
      if (isHashed(u.password)) return u;
      migrated = true;
      return { ...u, password: await hashPassword(u.password) };
    })
  );
  if (migrated) writeRaw(USERS_DB_KEY, upgraded);
  return upgraded;
}

function writeUsersDb(users) {
  writeRaw(USERS_DB_KEY, users);
}

function readSession() {
  return readRaw(SESSION_KEY, null);
}

function readResetTokens() {
  return readRaw(RESET_TOKENS_KEY, []);
}

function writeResetTokens(tokens) {
  writeRaw(RESET_TOKENS_KEY, tokens);
}

export function roleHomePath(role) {
  return role === ROLES.ADMIN ? "/admin/dashboard" : "/home";
}

/** Lightweight, non-hook helper for the dashboard's "Registered Users" stat. */
export async function countRegisteredUsers() {
  const users = await loadUsersDb();
  return users.length;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session + run any pending password-format migration on first load.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadUsersDb();
      if (!cancelled) {
        setUser(readSession());
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

async function login(email, password) {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });

    const sessionUser = response.data.user;

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(sessionUser)
    );

    setUser(sessionUser);

    return sessionUser;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Login failed"
    );
  }
}

  async function register({ name, email, password }) {
  try {
    const response = await api.post("/register", {
      name,
      email,
      password,
    });

    const sessionUser = response.data.user;

    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify(sessionUser)
    );

    setUser(sessionUser);

    return sessionUser;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Registration failed"
    );
  }
}

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
    if (isFirebaseConfigured && auth?.currentUser) {
      // Best-effort: don't block local logout if Firebase sign-out fails.
      firebaseSignOut(auth).catch(() => {});
    }
  }

  /**
   * Google Sign-In via Firebase Authentication. Maps the Firebase user onto
   * our local session shape so the rest of the app (which only knows about
   * { name, email, role }) doesn't need to know Google was involved.
   * New Google accounts default to the "user" role, same as email signup.
   */
  async function loginWithGoogle() {
    if (!isFirebaseConfigured) {
      throw new Error(
        "Google Sign-In isn't configured yet. Add your Firebase credentials to a .env file (see .env.example)."
      );
    }

    let credential;
    try {
      credential = await signInWithPopup(auth, googleProvider);
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") {
        throw new Error("Google sign-in was cancelled.");
      }
      throw new Error("Google sign-in failed. Please try again.");
    }

    const googleUser = credential.user;
    const email = googleUser.email;
    const name = googleUser.displayName || email.split("@")[0];

    const users = await loadUsersDb();
    let match = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!match) {
      // First time signing in with this Google account: create a local
      // profile for them (with an unusable random password hash, since
      // they'll always authenticate through Google, not email/password).
      match = { name, email, password: await hashPassword(generateId("google")), role: ROLES.USER };
      writeUsersDb([...users, match]);
      logActivity({ type: "auth", action: "create", message: `${name} signed up with Google` });
    }

    const sessionUser = { name: match.name, email: match.email, role: match.role };
    writeRaw(SESSION_KEY, sessionUser);
    setUser(sessionUser);
    logActivity({ type: "auth", action: "login", message: `${sessionUser.name} logged in with Google` });
    return sessionUser;
  }

  /**
   * Step 1 of password reset. In a real app this would email a link
   * containing the token; since there's no backend/mail server here, the
   * token is returned so the UI can hand the person straight to the reset
   * screen. Always resolves (never reveals whether the email exists).
   */
  async function requestPasswordReset(email) {
    const trimmedEmail = String(email || "").trim();
    if (!trimmedEmail || !isValidEmail(trimmedEmail)) {
      throw new Error("Enter a valid email address.");
    }

    const users = await loadUsersDb();
    const match = users.find((u) => u.email.toLowerCase() === trimmedEmail.toLowerCase());
    if (!match) {
      return null; // Don't leak account existence to the caller.
    }

    const tokens = readResetTokens().filter((t) => t.email.toLowerCase() !== trimmedEmail.toLowerCase());
    const token = generateId("reset");
    tokens.push({ token, email: match.email, expiresAt: Date.now() + RESET_TOKEN_TTL_MS });
    writeResetTokens(tokens);
    logActivity({ type: "auth", action: "update", message: `Password reset requested for ${match.email}` });
    return token;
  }

  /** Step 2 of password reset: exchange a valid token for a new password. */
  async function resetPassword(token, newPassword) {
    if (!token) throw new Error("Reset link is invalid or missing.");
    const passwordError = validatePasswordStrong(newPassword);
    if (passwordError) throw new Error(passwordError);

    const tokens = readResetTokens();
    const record = tokens.find((t) => t.token === token);
    if (!record) throw new Error("This reset link is invalid. Please request a new one.");
    if (Date.now() > record.expiresAt) {
      writeResetTokens(tokens.filter((t) => t.token !== token));
      throw new Error("This reset link has expired. Please request a new one.");
    }

    const users = await loadUsersDb();
    const index = users.findIndex((u) => u.email.toLowerCase() === record.email.toLowerCase());
    if (index === -1) throw new Error("Account no longer exists.");

    users[index] = { ...users[index], password: await hashPassword(newPassword) };
    writeUsersDb(users);
    writeResetTokens(tokens.filter((t) => t.token !== token));
    logActivity({ type: "auth", action: "update", message: `Password reset for ${record.email}` });
    return true;
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === ROLES.ADMIN,
    login,
    register,
    logout,
    loginWithGoogle,
    isGoogleAuthAvailable: isFirebaseConfigured,
    requestPasswordReset,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
