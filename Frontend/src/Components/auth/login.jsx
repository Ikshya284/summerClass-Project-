import video from "../../Images/vdo.mp4";
import googleIcon from "../../Images/google.png";
import logo from "../../Images/logo_img.png";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth, roleHomePath } from "../../context/AuthContext";
import { validateEmailField, validateRequired } from "../../utils/validators";

function LoginPage() {

const videoRef = useRef(null);
const navigate = useNavigate();
const location = useLocation();
const { login, loginWithGoogle } = useAuth();

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [fieldErrors, setFieldErrors] = useState({});
const [error, setError] = useState("");
const [submitting, setSubmitting] = useState(false);
const [googleSubmitting, setGoogleSubmitting] = useState(false);

useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = 0.25; // 25% speed
  }
}, []);

function validate() {
  const errors = {
    email: validateEmailField(email),
    password: validateRequired(password, "Password"),
  };
  setFieldErrors(errors);
  return !errors.email && !errors.password;
}

async function handleSubmit(e) {
  e.preventDefault();
  setError("");
  if (!validate()) return;

  setSubmitting(true);
  try {
    const loggedInUser = await login(email, password);
    toast.success(`Welcome back, ${loggedInUser.name}!`);
    // If the user was redirected here from a protected page, send them
    // back there; otherwise go to their role's default destination.
    const from = location.state?.from?.pathname;
    navigate(from || roleHomePath(loggedInUser.role), { replace: true });
  } catch (err) {
    setError(err.message || "Unable to log in.");
    toast.error(err.message || "Unable to log in.");
  } finally {
    setSubmitting(false);
  }
}

async function handleGoogleLogin() {
  setGoogleSubmitting(true);
  try {
    const loggedInUser = await loginWithGoogle();
    toast.success(`Welcome, ${loggedInUser.name}!`);
    const from = location.state?.from?.pathname;
    navigate(from || roleHomePath(loggedInUser.role), { replace: true });
  } catch (err) {
    toast.error(err.message || "Google sign-in failed.");
  } finally {
    setGoogleSubmitting(false);
  }
}

  return (
    <div className="flex min-h-screen bg-[#FBFBFD]">

      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center overflow-y-auto py-8">

        <div className="w-full max-w-xl px-10">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt="CookCraft Logo"
              className="w-44"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-black">
              Welcome Back!
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Cook. Save. Savor.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit} noValidate>

            {error && (
              <p className="text-center text-red-500 font-medium">{error}</p>
            )}

            {/* Email */}
            <div>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((f) => ({ ...f, email: null }));
                  }}
                  autoComplete="email"
                  aria-invalid={Boolean(fieldErrors.email)}
                  className="w-full h-14 rounded-full border-2 px-6 pr-14 outline-none transition-colors duration-200 focus:border-[#F38D39]"
                  style={{ borderColor: fieldErrors.email ? "#C2495E" : "#D1D5DB" }}
                />

                <i className="fa-solid fa-user absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
              </div>
              {fieldErrors.email && (
                <p className="text-sm text-red-500 mt-1.5 ml-4">{fieldErrors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((f) => ({ ...f, password: null }));
                  }}
                  autoComplete="current-password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  className="w-full h-14 rounded-full border-2 px-6 pr-14 outline-none transition-colors duration-200 focus:border-[#F38D39]"
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
              {fieldErrors.password && (
                <p className="text-sm text-red-500 mt-1.5 ml-4">{fieldErrors.password}</p>
              )}
            </div>

            {/* Remember & Forgot Password */}
            <div className="flex items-center justify-between">

              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">

                <input
                  type="checkbox"
                  className="accent-[#F38D39] w-4 h-4"
                />

                Remember Me

              </label>

              <Link
                to="/forgot-password"
                className="text-[#F38D39] hover:underline"
              >
                Forgot Password?
              </Link>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-full bg-[#F38D39] text-white text-xl font-semibold hover:bg-[#E67820] transition duration-300 shadow-md disabled:opacity-60"
            >
              {submitting ? "Logging in..." : "Login"}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">

              <div className="flex-1 border-t border-gray-300"></div>

              <span className="text-gray-500">or</span>

              <div className="flex-1 border-t border-gray-300"></div>

            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleSubmitting}
              className="w-full h-14 rounded-full border-2 border-gray-300 flex items-center justify-center gap-3 hover:bg-gray-100 transition disabled:opacity-60"
            >
              <img
                src={googleIcon}
                alt="Google"
                className="w-6 h-6"
              />

              <span className="font-medium">
                {googleSubmitting ? "Signing in..." : "Continue with Google"}
              </span>
            </button>

            {/* Sign Up */}
            <p className="text-center text-gray-600 pt-2">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-[#F38D39] hover:underline"
              >
                Sign Up
              </Link>
            </p>

          </form>

        </div>

      </div>

      {/* Right Section */}
        <div className="hidden lg:block lg:w-1/2">
            <video
            ref={videoRef}
            src={video}
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={() => {
                if (videoRef.current) {
                    videoRef.current.playbackRate = 0.25;
                }
            }}
            className="w-full h-screen object-cover"
            />
        </div>

</div>
  );
}

export default LoginPage;
