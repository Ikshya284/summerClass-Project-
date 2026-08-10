import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlass as Search,
  Bell,
  List as Menu,
  X,
  SignOut,
} from "phosphor-react";

import { useAuth } from "../context/AuthContext";
import { COLORS, displayFont } from "../utils/theme";
import logo from "../Images/logo_img.png";

const NAV_LINKS = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Recipes", path: "/admin/recipes" },
  { label: "About", path: "/admin/about" },
];

export default function AdminHeader({ active }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  function handleNavigate(path) {
    setMobileOpen(false);
    navigate(path);
  }

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        backgroundColor: "rgba(250,248,245,0.92)",
        backdropFilter: "blur(10px)",
        borderBottom: `1px solid ${COLORS.border}`,
      }}
    >
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">

        {/* Logo */}
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src={logo} alt="CookCraft logo" className="h-10 w-auto object-contain" />
        </button>


        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavigate(link.path)}
              className="text-sm font-medium transition-colors duration-200 cursor-pointer"
              style={{
                color:
                  active === link.label
                    ? COLORS.primaryDark
                    : COLORS.secondary,
                ...displayFont,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primaryDark)}
              onMouseLeave={(e) => (e.currentTarget.style.color = active === link.label ? COLORS.primaryDark : COLORS.secondary)}
            >
              {link.label}
            </button>
          ))}
        </nav>


        {/* Right Section */}
        <div className="flex items-center gap-3">


          {/* User */}
          <div className="flex items-center gap-2">

            <div
              className="w-10 h-10 rounded-full flex items-center justify-center border-2"
              style={{
                borderColor: COLORS.border,
                backgroundColor: COLORS.cream,
              }}
            >
              <span
                className="font-bold"
                style={{
                  ...displayFont,
                  color: COLORS.primaryDark,
                }}
              >
                {(user?.name || "A")
                  .charAt(0)
                  .toUpperCase()}
              </span>
            </div>


            <span
              className="hidden md:block text-sm font-semibold"
              style={{
                ...displayFont,
                color: COLORS.dark,
              }}
            >
              {user?.name || "Admin"}
            </span>

          </div>


          {/* Logout */}
          <button
            onClick={handleLogout}
            className="hidden sm:flex text-sm font-semibold px-5 py-2.5 rounded-full text-white shadow-sm transition-transform duration-200 hover:scale-105 items-center gap-2"
            style={{
              backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
              ...displayFont,
            }}
          >
            <SignOut size={16} weight="bold" /> Logout
          </button>


          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              backgroundColor: COLORS.cream,
            }}
          >
            {mobileOpen ? (
              <X size={22} color={COLORS.primaryDark} />
            ) : (
              <Menu size={22} color={COLORS.primaryDark} />
            )}
          </button>

        </div>
      </div>



      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav
          className="lg:hidden flex flex-col px-5 pb-4 gap-2"
          style={{
            backgroundColor: COLORS.bg,
          }}
        >

          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavigate(link.path)}
              className="text-left px-3 py-2 rounded-xl text-sm font-medium"
              style={{
                color:
                  active === link.label
                    ? COLORS.primaryDark
                    : COLORS.secondary,

                backgroundColor:
                  active === link.label
                    ? COLORS.cream
                    : "transparent",

                ...displayFont,
              }}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-full text-white mt-2"
            style={{
              backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`,
              ...displayFont,
            }}
          >
            <SignOut size={16} weight="bold" /> Logout
          </button>

        </nav>
      )}

    </header>
  );
}