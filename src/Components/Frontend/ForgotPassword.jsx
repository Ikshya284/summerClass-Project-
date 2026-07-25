import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../Images/logo_img.png";

/**
 * Placeholder screen for the "Forgot Password?" link on the login page.
 * Wire handleSubmit up to a real "send reset email" endpoint later.
 */
function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Email is required.");
      return;
    }

    setLoading(true);
    // TODO: replace with `await axios.post("/api/auth/forgot-password", { email: trimmedEmail })`
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success("Reset link sent");
    }, 1500);
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
            Enter your email and we'll send you a reset link.
          </p>
        </div>

        {sent ? (
          <p className="text-center text-gray-600">
            If an account exists for <span className="font-semibold">{email.trim()}</span>, a reset link is on its way.
          </p>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <label htmlFor="reset-email" className="sr-only">
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              aria-label="Email address"
              className="w-full h-14 rounded-full border-2 border-gray-300 px-6 outline-none transition-colors duration-300 focus:border-[#F38D39] disabled:opacity-60 disabled:cursor-not-allowed"
            />

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
