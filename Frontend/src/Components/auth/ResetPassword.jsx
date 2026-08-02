import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../Images/logo_img.png";
import { useAuth } from "../../context/AuthContext";
import { validatePasswordStrong } from "../../utils/validators";

/**
 * Step 2 of password reset: exchanges the token from the URL (produced by
 * ForgotPassword.jsx) for a new password via AuthContext.resetPassword.
 */
function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { resetPassword } = useAuth();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  function validate() {
    const errors = {
      password: validatePasswordStrong(password),
      confirmPassword: confirmPassword !== password ? "Passwords do not match." : null,
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate("/login", { replace: true }), 1400);
    } catch (err) {
      setError(err.message || "Could not reset password.");
      toast.error(err.message || "Could not reset password.");
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FBFBFD] px-6">
        <div className="w-full max-w-md text-center">
          <img src={logo} alt="CookCraft Logo" className="w-40 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-black mb-2">Invalid reset link</h1>
          <p className="text-gray-500 mb-6">This reset link is missing or invalid. Please request a new one.</p>
          <Link to="/forgot-password" className="font-semibold text-[#F38D39] hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFBFD] px-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="CookCraft Logo" className="w-40" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Set a new password</h1>
          <p className="text-gray-500 mt-2">Choose a strong password for your account.</p>
        </div>

        {done ? (
          <p className="text-center text-gray-600">
            Your password has been reset. Redirecting you to login...
          </p>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            {error && <p className="text-center text-red-500 font-medium">{error}</p>}

            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((f) => ({ ...f, password: null }));
                  }}
                  autoComplete="new-password"
                  className="w-full h-14 rounded-full border-2 px-6 pr-14 outline-none transition-colors duration-300 focus:border-[#F38D39]"
                  style={{ borderColor: fieldErrors.password ? "#C2495E" : "#D1D5DB" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                </button>
              </div>
              {fieldErrors.password ? (
                <p className="text-sm text-red-500 mt-1.5 ml-4">{fieldErrors.password}</p>
              ) : (
                <p className="text-xs text-gray-400 mt-1.5 ml-4">
                  8+ characters, with uppercase, lowercase, a number, and a special character.
                </p>
              )}
            </div>

            <div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setFieldErrors((f) => ({ ...f, confirmPassword: null }));
                }}
                autoComplete="new-password"
                className="w-full h-14 rounded-full border-2 px-6 outline-none transition-colors duration-300 focus:border-[#F38D39]"
                style={{ borderColor: fieldErrors.confirmPassword ? "#C2495E" : "#D1D5DB" }}
              />
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1.5 ml-4">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-full bg-[#F38D39] text-white text-xl font-semibold hover:bg-[#E67820] transition duration-300 shadow-md disabled:opacity-70"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 pt-6">
          <Link to="/login" className="font-semibold text-[#F38D39] hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
