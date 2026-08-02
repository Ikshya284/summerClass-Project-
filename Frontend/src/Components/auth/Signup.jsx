import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import video from "../../Images/vdo.mp4";
import googleIcon from "../../Images/google.png";
import logo from "../../Images/logo_img.png";

import { useAuth, roleHomePath } from "../../context/AuthContext";
import {
  validateEmailField,
  validateName,
  validatePasswordStrong,
} from "../../utils/validators";

function SignUpPage() {

    const videoRef = useRef(null);
    const navigate = useNavigate();
    const { register, loginWithGoogle } = useAuth();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        username: validateName(username, "Username"),
        email: validateEmailField(email),
        password: validatePasswordStrong(password),
        confirmPassword: !confirmPassword
          ? "Please confirm your password."
          : confirmPassword !== password
          ? "Passwords do not match."
          : null,
      };
      setFieldErrors(errors);
      return !Object.values(errors).some(Boolean);
    }

    async function handleSubmit(e) {
      e.preventDefault();
      setError("");

      if (!validate()) return;

      if (!acceptedTerms) {
        setError("Please accept the Terms & Conditions.");
        toast.error("Please accept the Terms & Conditions.");
        return;
      }

      setSubmitting(true);
      try {
        const newUser = await register({ name: username, email, password });
        toast.success(`Welcome to CookCraft, ${newUser.name}!`);
        navigate(roleHomePath(newUser.role), { replace: true });
      } catch (err) {
        setError(err.message || "Unable to create account.");
        toast.error(err.message || "Unable to create account.");
      } finally {
        setSubmitting(false);
      }
    }

    async function handleGoogleSignUp() {
      setGoogleSubmitting(true);
      try {
        const newUser = await loginWithGoogle();
        toast.success(`Welcome to CookCraft, ${newUser.name}!`);
        navigate(roleHomePath(newUser.role), { replace: true });
      } catch (err) {
        toast.error(err.message || "Google sign-in failed.");
      } finally {
        setGoogleSubmitting(false);
      }
    }

  return (
    <div className="flex h-screen bg-[#FBFBFD]">

      {/* Left Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-3">

        <div className="w-full max-w-lg px-10">

          {/* Logo */}
          <div className="flex justify-center mb-4">
            <img
              src={logo}
              alt="CookCraft Logo"
              className="w-44"
            />
          </div>

          {/* Heading */}
          <div className="text-center mb-5">
            <h1 className="text-4xl font-bold text-black">
              Create an account
            </h1>

            <p className="text-gray-500 mt-2 text-lg">
              Cook. Save. Savor.
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>

            {error && (
              <p className="text-center text-red-500 font-medium">{error}</p>
            )}

            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setFieldErrors((f) => ({ ...f, username: null }));
                }}
                className="w-full h-14 rounded-full border-2 px-6 outline-none focus:border-[#F38D39]"
                style={{ borderColor: fieldErrors.username ? "#C2495E" : "#D1D5DB" }}
              />
              {fieldErrors.username && (
                <p className="text-sm text-red-500 mt-1.5 ml-4">{fieldErrors.username}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setFieldErrors((f) => ({ ...f, email: null }));
                }}
                className="w-full h-14 rounded-full border-2 px-6 outline-none focus:border-[#F38D39]"
                style={{ borderColor: fieldErrors.email ? "#C2495E" : "#D1D5DB" }}
              />
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
                  className="w-full h-14 rounded-full border-2 px-6 pr-14 outline-none focus:border-[#F38D39]"
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

            {/* Confirm Password */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setFieldErrors((f) => ({ ...f, confirmPassword: null }));
                  }}
                  className="w-full h-14 rounded-full border-2 px-6 pr-14 outline-none focus:border-[#F38D39]"
                  style={{ borderColor: fieldErrors.confirmPassword ? "#C2495E" : "#D1D5DB" }}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                >
                  <i className={showConfirmPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1.5 ml-4">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="accent-[#F38D39] w-4 h-4"
              />

              <label className="text-[#F38D39] cursor-pointer hover:underline">
                Accept Terms & Conditions
              </label>
            </div>

            {/* Sign Up */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full h-14 rounded-full bg-[#F38D39] text-white text-xl font-semibold hover:bg-[#E67820] transition duration-300 shadow-md disabled:opacity-60"
            >
              {submitting ? "Creating account..." : "Sign Up"}
            </button>

            {/* OR */}
            <div className="flex items-center gap-4 py-1">
              <div className="flex-1 border-t border-gray-300"></div>

              <span className="text-gray-500">
                or
              </span>

              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={googleSubmitting}
              className="w-full h-14 rounded-full border-2 border-gray-300 flex items-center justify-center gap-3 hover:bg-gray-100 transition disabled:opacity-60"
            >
              <img
                src={googleIcon}
                alt="Google"
                className="w-6 h-6"
              />

              <span className="font-medium">
                {googleSubmitting ? "Signing in..." : "Sign up using Google"}
              </span>
            </button>

            {/* Login */}
            <p className="text-center text-gray-600 pt-1">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#F38D39] hover:underline"
              >
                Sign In
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

export default SignUpPage;