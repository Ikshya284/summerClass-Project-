import video from "../Images/vdo.mp4";
import googleIcon from "../Images/google.png";
import logo from "../Images/logo_img.png";
import { useEffect, useRef } from "react";

function LoginPage() {

const videoRef = useRef(null);

useEffect(() => {
  if (videoRef.current) {
    videoRef.current.playbackRate = 0.25; // 25% speed
  }
}, []);

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
          <form className="space-y-5">

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full h-14 rounded-full border-2 border-gray-300 px-6 pr-14 outline-none focus:border-[#F38D39]"
              />

              <i className="fa-solid fa-user absolute right-6 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full h-14 rounded-full border-2 border-gray-300 px-6 pr-14 outline-none focus:border-[#F38D39]"
              />

              <i className="fa-solid fa-eye-slash absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"></i>
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

              <a
                href="#"
                className="text-[#F38D39] hover:underline"
              >
                Forgot Password?
              </a>

            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full h-14 rounded-full bg-[#F38D39] text-white text-xl font-semibold hover:bg-[#E67820] transition duration-300 shadow-md"
            >
              Login
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
              className="w-full h-14 rounded-full border-2 border-gray-300 flex items-center justify-center gap-3 hover:bg-gray-100 transition"
            >
              <img
                src={googleIcon}
                alt="Google"
                className="w-6 h-6"
              />

              <span className="font-medium">
                Continue with Google
              </span>
            </button>

            {/* Sign Up */}
            <p className="text-center text-gray-600 pt-2">
              Don't have an account?{" "}
              <a
                href="#"
                className="font-semibold text-[#F38D39] hover:underline"
              >
                Sign Up
              </a>
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