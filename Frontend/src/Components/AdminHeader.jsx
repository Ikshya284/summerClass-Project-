import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass as Search, Bell, List as Menu, X, ForkKnife as ChefHat, SignOut } from "phosphor-react";
import { useAuth } from "../context/AuthContext";
import { COLORS, displayFont } from "../utils/theme";

const NAV_LINKS = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Recipes", path: "/admin/recipes" },
  { label: "Ingredients", path: "/admin/ingredients" },
  { label: "Categories", path: "/admin/category-page" },
];

/** Shared top navigation for every admin screen so the chrome never drifts between pages. */
export default function AdminHeader({ active }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }

  return (
    <header
      className="sticky top-0 z-50"
      style={{ backgroundColor: "rgba(250,248,245,0.92)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${COLORS.border}` }}
    >
      <div className="max-w-[1440px] mx-auto px-5 md:px-8 flex items-center justify-between h-18 py-3">
        <div className="flex items-center gap-3">
          <button className="lg:hidden" onClick={() => setMobileOpen((v) => !v)} aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <button className="flex items-center gap-2" onClick={() => navigate("/admin/dashboard")}>
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
              style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
            >
              <ChefHat size={22} color="#fff" />
            </div>
            <span style={{ ...displayFont, color: COLORS.dark }} className="text-xl font-bold tracking-tight">
              CookCraft
            </span>
          </button>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => navigate(link.path)}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: active === link.label ? COLORS.primaryDark : COLORS.secondary, ...displayFont }}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            className="w-10 h-10 rounded-full hidden sm:flex items-center justify-center transition-transform duration-200 hover:scale-110"
            style={{ backgroundColor: COLORS.cream }}
          >
            <Search size={18} color={COLORS.primaryDark} />
          </button>
          <button
            aria-label="Notifications"
            className="relative w-10 h-10 rounded-full hidden sm:flex items-center justify-center transition-transform duration-200 hover:scale-110"
            style={{ backgroundColor: COLORS.cream }}
          >
            <Bell size={18} color={COLORS.primaryDark} />
            <span
              className="absolute top-1.5 right-2 w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS.roseText, border: `1.5px solid ${COLORS.cream}` }}
            />
          </button>
          <div className="flex items-center gap-2 pl-1">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 flex items-center justify-center" style={{ borderColor: COLORS.border, backgroundColor: COLORS.cream }}>
              <span style={{ ...displayFont, color: COLORS.primaryDark }} className="text-sm font-bold">
                {(user?.name || "A").charAt(0).toUpperCase()}
              </span>
            </div>
            <span style={{ ...displayFont, color: COLORS.dark }} className="hidden md:inline text-sm font-semibold">
              {user?.name || "Admin"}
            </span>
          </div>
          <button
            aria-label="Logout"
            onClick={handleLogout}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
            style={{ backgroundColor: COLORS.cream }}
          >
            <SignOut size={18} color={COLORS.primaryDark} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden flex flex-col px-5 pb-4 gap-1" style={{ backgroundColor: COLORS.bg }}>
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => {
                setMobileOpen(false);
                navigate(link.path);
              }}
              className="text-left text-sm font-medium py-2.5 px-2 rounded-xl transition-colors duration-200"
              style={{
                color: active === link.label ? COLORS.primaryDark : COLORS.secondary,
                backgroundColor: active === link.label ? COLORS.cream : "transparent",
                ...displayFont,
              }}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
