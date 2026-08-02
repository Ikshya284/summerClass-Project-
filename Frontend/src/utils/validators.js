/**
 * Shared, framework-agnostic validation helpers.
 * Keeping these in one place means every form (Login, Signup, Recipe,
 * Ingredient...) validates the same way instead of re-implementing regexes.
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value) {
  return EMAIL_RE.test(String(value || "").trim());
}

/**
 * Password policy: at least 6 characters, containing at least one letter
 * and one number. Returns null when valid, or an error message when not.
 */
export function validatePassword(value) {
  const password = String(value || "");
  if (!password) return "Password is required.";
  if (password.length < 6) return "Password must be at least 6 characters.";
  if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    return "Password must contain at least one letter and one number.";
  }
  return null;
}

/**
 * Stricter password policy used for account creation and password reset:
 * at least 8 characters, one uppercase letter, one lowercase letter, one
 * number, and one special character. Returns null when valid, or the
 * specific unmet requirement as a message when not.
 */
export function validatePasswordStrong(value) {
  const password = String(value || "");
  if (!password) return "Password is required.";
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  if (!/[^A-Za-z0-9]/.test(password)) return "Password must contain at least one special character.";
  return null;
}

export function validateEmailField(value) {
  const email = String(value || "").trim();
  if (!email) return "Email is required.";
  if (!isValidEmail(email)) return "Enter a valid email address.";
  return null;
}

export function validateRequired(value, label = "This field") {
  if (!String(value ?? "").trim()) return `${label} is required.`;
  return null;
}

export function validateName(value, label = "Name", min = 2) {
  const v = String(value || "").trim();
  if (!v) return `${label} is required.`;
  if (v.length < min) return `${label} must be at least ${min} characters.`;
  return null;
}
