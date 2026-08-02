import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../Images/logo_img.png";
import { useAuth } from "../../context/AuthContext";
import { validateEmailField } from "../../utils/validators";

/**
 * Step 1 of password reset. Real backends would email a reset link here;
 * since this project has no mail server, `requestPasswordReset` returns the
 * token directly so we can hand the person straight to the Reset Password
 * screen. The "if an account exists..." wording is intentional: it never
 * confirms or denies whether the email is registered.
 */
function ForgotPassword() {
  const navigate = useNavigate();
  const { requestPasswordReset } = useAuth();

  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resetToken, setResetToken] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const emailError = validateEmailField(email);
    setFieldError(emailError || "");
    if (emailError) return;

    setLoading(true);
    try {
      const token = await requestPasswordReset(email);
      setResetToken(token);
      setSent(true);
      toast.success("If that email is registered, a reset link has been generated.");
    } catch (err) {
      toast.error(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FBFBFD] px-6">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="CookCraft Logo" className="w-40" />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Reset your password</h1>
          <p className="text-gray-500 mt-2">
            Enter your email and we'll get you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="text-center space-y-5">
            <p className="text-gray-600">
              If an account exists for <span className="font-semibold">{email.trim()}</span>, a reset link is ready.
            </p>

            {resetToken ? (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 text-left">
                <p className="text-sm text-gray-600 mb-3">
                  This project doesn't have an email server connected yet, so — for demo purposes only — here's your reset link directly:
                </p>
                <button
                  type="button"
                  onClick={() => navigate(`/reset-password?token=${resetToken}`)}
                  className="w-full h-12 rounded-full bg-[#F38D39] text-white font-semibold hover:bg-[#E67820] transition duration-300 shadow-sm"
                >
                  Continue to reset password
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Didn't get a link? Double-check the email address and try again.
              </p>
            )}
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <label htmlFor="reset-email" className="sr-only">
              Email address
            </label>
            <div>
              <input
                id="reset-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldError("");
                }}
                disabled={loading}
                autoComplete="email"
                aria-label="Email address"
                aria-invalid={Boolean(fieldError)}
                className="w-full h-14 rounded-full border-2 px-6 outline-none transition-colors duration-300 focus:border-[#F38D39] disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ borderColor: fieldError ? "#C2495E" : "#D1D5DB" }}
              />
              {fieldError && <p className="text-sm text-red-500 mt-1.5 ml-4">{fieldError}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-full bg-[#F38D39] text-white text-xl font-semibold hover:bg-[#E67820] transition duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F38D39] focus-visible:ring-offset-2"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="text-center text-gray-600 pt-6">
          <Link
            to="/login"
            className="font-semibold text-[#F38D39] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F38D39] focus-visible:ring-offset-2 rounded"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
