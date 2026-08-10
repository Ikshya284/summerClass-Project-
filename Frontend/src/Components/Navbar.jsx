import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { COLORS, displayFont } from "../utils/theme";
import { List as Menu, X, SignOut } from "phosphor-react";
import logo from "../Images/logo_img.png";

const NAV_LINKS = [
  { label: "Home", path: "/home" },
  { label: "Recipes", path: "/recipes" },
  { label: "About", path: "/admin/about" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  function goTo(link) {
    setMenuOpen(false);
    if (location.pathname === link.path) {
      if (link.hash) {
        document.querySelector(link.hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      navigate(link.hash ? `${link.path}${link.hash}` : link.path);
    }
  }

  function isActive(link) {
    if (location.pathname !== link.path) return false;
    return link.hash ? location.hash === link.hash : !location.hash;
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
      style={{ backgroundColor: "rgba(250,248,245,0.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${COLORS.border}` }}
    >
      <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-18 py-3">
        <button className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/home")} aria-label="CookCraft home">
          <img src={logo} alt="CookCraft logo" className="h-10 w-auto object-contain" />
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => goTo(link)}
              className="text-sm font-medium transition-colors duration-200 cursor-pointer"
              style={{ color: isActive(link) ? COLORS.primary : COLORS.secondary, ...displayFont }}
              onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
              onMouseLeave={(e) => (e.currentTarget.style.color = isActive(link) ? COLORS.primary : COLORS.secondary)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center border-2"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}
          >
            <span className="font-bold" style={{ ...displayFont, color: COLORS.primaryDark }}>
              {(user?.name || "U").charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-sm font-semibold hidden lg:inline" style={{ color: COLORS.dark, ...displayFont }}>
            Hi, {user?.name?.split(" ")[0] || "Chef"}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm font-semibold px-5 py-2.5 rounded-full text-white shadow-sm transition-transform duration-200 hover:scale-105 flex items-center gap-2"
            style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
          >
            <SignOut size={16} weight="bold" /> Logout
          </button>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden px-5 pb-5 flex flex-col gap-4" style={{ borderTop: `1px solid ${COLORS.border}` }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => goTo(link)}
              className="text-sm font-medium pt-3 text-left"
              style={{ color: isActive(link) ? COLORS.primary : COLORS.dark, ...displayFont }}
            >
              {link.label}
            </button>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleLogout}
              className="flex-1 text-sm font-semibold px-4 py-2.5 rounded-full text-white flex items-center justify-center gap-2"
              style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
            >
              <SignOut size={16} weight="bold" /> Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
