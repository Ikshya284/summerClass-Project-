import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
} from "phosphor-react";
import AdminHeader from "../Components/AdminHeader";
import Navbar from "../Components/Navbar";
import { useAuth, ROLES, roleHomePath } from "../context/AuthContext";
import { COLORS, displayFont, bodyFont } from "../utils/theme";

import heroVideo from "../Images/Hero.mp4";
import chefPhoto from "../Images/Chef.jpg";

export default function AdminAbout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  return (
    <div style={{ backgroundColor: COLORS.bg, ...bodyFont, color: COLORS.dark }} className="min-h-screen w-full">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>
      {isAdmin ? <AdminHeader active="About" /> : <Navbar />}

      {/* Hero: video with overlaid text */}
      <div className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={heroVideo} type="video/mp4" />
        </video>

        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.05) 75%)",
          }}
        />

        <div className="relative z-10 h-full flex flex-col">
          <div className="max-w-5xl mx-auto w-full px-5 md:px-8 pt-8">
            <button
              onClick={() => navigate(roleHomePath(user?.role))}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border backdrop-blur-sm transition-colors duration-200"
              style={{ borderColor: "rgba(255,255,255,0.35)", backgroundColor: "rgba(255,255,255,0.12)", color: "#fff" }}
            >
              <ArrowLeft size={16} /> Back to {isAdmin ? "dashboard" : "home"}
            </button>
          </div>

          <div className="flex-1 flex items-center">
            <div className="max-w-5xl mx-auto w-full px-5 md:px-8">
              <div className="max-w-lg">
                <span
                  className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-5"
                  style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "#fff", ...displayFont }}
                >
                  {isAdmin ? "CookCraft Admin" : "CookCraft"}
                </span>
                <h1 style={{ ...displayFont, color: "#fff" }} className="text-4xl md:text-5xl font-bold mb-5 leading-tight">
                  About Us
                </h1>
                <p className="text-sm md:text-base leading-7" style={{ color: "rgba(255,255,255,0.85)" }}>
                  CookCraft is the home for your recipes — save them, organize them, and cook
                  them with confidence, one dish at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-5 md:px-8">
        {/* Intro split */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center py-14 md:py-20">
          <div>
            <img src={chefPhoto} alt="Cooking in the kitchen" className="w-full rounded-2xl object-cover shadow-sm" />
            <p className="mt-3 text-xs" style={{ color: COLORS.secondary }}>
              Every great meal starts with a good recipe, well kept.
            </p>
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.primaryDark }}>
              Home Sweet Kitchen
            </span>
            <h2 style={{ ...displayFont, color: COLORS.dark }} className="text-2xl md:text-3xl font-bold mt-2 mb-4">
              Every Recipe, Organized Your Way
            </h2>
            <p style={{ color: COLORS.secondary }} className="text-sm leading-7 mb-6">
              CookCraft is a recipe management platform created to make cooking easier, more
              enjoyable, and more organized. Whether you're a beginner learning your first recipe
              or an experienced home cook looking for new ideas, CookCraft helps you discover,
              save, and manage your favorite recipes in one place. We believe cooking is more
              than preparing food — it's a way to express creativity, share experiences, and
              bring people together.
            </p>

            <div className="flex gap-3">
              {[FacebookLogo, LinkedinLogo, InstagramLogo].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full border flex items-center justify-center transition-colors duration-200 hover:opacity-70"
                  style={{ borderColor: COLORS.border, color: COLORS.dark }}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
