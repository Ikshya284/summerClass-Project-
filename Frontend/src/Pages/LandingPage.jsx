import logo from "../Images/logo_img.png";
import foods from "../Images/food.png";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, roleHomePath } from "../context/AuthContext";
import {
  BookmarkSimple as Bookmark,
  UploadSimple as Upload,
  Funnel as FilterIcon,
  Leaf,
} from "phosphor-react";

const FEATURES = [
  {
    Icon: Bookmark,
    title: "Save Recipes",
    desc: "Bookmark your favorite dishes and build a personal cookbook you can revisit anytime.",
  },
  {
    Icon: Upload,
    title: "Upload Your Own Recipes",
    desc: "Share your family classics and original creations with a community of home cooks.",
  },
  {
    Icon: Leaf,
    title: "Smart Ingredient Management",
    desc: "Track what's in your pantry and get recipe matches based on what you already have.",
  },
  {
    Icon: FilterIcon,
    title: "Fast Search & Filtering",
    desc: "Find the perfect recipe in seconds with filters for time, difficulty, and diet.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  function handleAccountClick() {
    // An already-authenticated user pressing "Login" is redirected
    // straight to their role-based destination instead of the form.
    navigate(isAuthenticated ? roleHomePath(user.role) : "/login");
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <nav className="sticky top-0 bg-[#FAF8F5]/90 backdrop-blur border-b border-orange-100">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <img src={logo} alt="CookCraft" className="w-28" />
          <ul className="hidden lg:flex gap-10 font-medium text-gray-800">
            {["Home","Recipes","About"].map(i=>(
              <li key={i} className="hover:text-[#F38D39] cursor-pointer">{i}</li>
            ))}
          </ul>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="bg-[#F38D39] text-white px-6 py-3 rounded-full hover:bg-[#e97c25] shadow"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/register"
                className="bg-[#F38D39] text-white px-6 py-3 rounded-full hover:bg-[#e97c25] shadow"
              >
                Get Started
              </Link>
            )}
            <button
              onClick={handleAccountClick}
              className="bg-white rounded-full px-3 py-2 shadow flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#F38D39] flex items-center justify-center text-white">
                <i className="fa-regular fa-circle-user"></i>
              </div>
              <div className="hidden md:block text-left">
                <p className="font-semibold text-sm">
                  {isAuthenticated ? user.name : "My Account"}
                </p>
                <p className="text-xs text-gray-500">
                  {isAuthenticated ? `Go to ${user.role === "admin" ? "Dashboard" : "Home"}` : "Login / Register"}
                </p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-8 py-10 flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2">
          <p className="uppercase tracking-[6px] text-[#F38D39] font-semibold mb-4">Welcome to CookCraft</p>
          <h1 className="text-6xl font-bold leading-tight">
            Discover Amazing <span className="text-[#F38D39]">Recipes</span>
          </h1>
          <p className="mt-8 text-lg leading-8 text-gray-600 max-w-xl">
            Explore hundreds of delicious recipes, discover new cuisines,
            save your favourite meals and share your own creations with the CookCraft community.
          </p>
          <div className="flex gap-5 mt-10">
            <button className="bg-[#F38D39] text-white px-8 py-4 rounded-full shadow hover:bg-[#e97c25]">Explore Recipes</button>
            <button className="border-2 border-[#F38D39] text-[#F38D39] px-8 py-4 rounded-full hover:bg-[#F38D39] hover:text-white">Browse Categories</button>
          </div>
        </div>

        <div className="lg:w-1/2 flex justify-center relative mt-10 lg:mt-0">
          <div className="absolute w-[550px] h-[550px] rounded-full bg-orange-100 blur-3xl opacity-50"></div>
          <img
            src={foods}
            alt="Food"
            className="relative w-[700px] drop-shadow-2xl animate-spin"
            style={{animationDuration:"25s",animationTimingFunction:"linear"}}
          />
        </div>
      </section>

      {/* ---------------- Why Choose CookCraft ---------------- */}
      <section id="why-choose" className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#2D2D2D]">
            Why Choose CookCraft
          </h2>
          <p className="max-w-xl mx-auto text-gray-500">
            Everything you need to plan, cook, and share great food.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-[#F3E8D9] bg-white/70 backdrop-blur-[6px]"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-[#F38D39] to-[#D96F1B]">
                <Icon size={22} color="#fff" />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-[#2D2D2D]">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
