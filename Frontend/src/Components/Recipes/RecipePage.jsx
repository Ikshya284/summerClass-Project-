import React, { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  X,
  Clock,
  Star,
  MoreVertical,
  Check,
  Edit3,
  BookOpen,
  Folder,
  Plus,
  Upload,
  RotateCcw,
  Eye,
  Bookmark,
  TrendingUp,
  ChefHat,
} from "lucide-react";

/* ---------------------------------- Design tokens ---------------------------------- */
const COLORS = {
  bg: "#FAF8F5",
  primary: "#F38D39",
  primaryDark: "#D96F1B",
  dark: "#262626",
  secondary: "#6B7280",
  card: "#FFFFFF",
  border: "#F0E4D7",
  cream: "#FDF3E7",
  success: "#4CAF50",
  successBg: "#EAF7EC",
  warning: "#FFB547",
  warningBg: "#FFF4E2",
  pending: "#F5C518",
  pendingBg: "#FDF6DC",
  archived: "#9CA3AF",
  archivedBg: "#F1F1F2",
  danger: "#EF4444",
};

const displayFont = { fontFamily: "'Poppins', sans-serif" };
const bodyFont = { fontFamily: "'Poppins', sans-serif" };

/* ---------------------------------- Data ---------------------------------- */
const TOP_NAV = ["Dashboard", "Recipes", "Categories", "Users", "Analytics"];

const STATS = [
  { label: "Recipe Count", value: "1,284", growth: "+12%", up: true, Icon: BookOpen, tint: COLORS.cream, iconColor: COLORS.primary },
  { label: "Published Recipes", value: "986", growth: "+8%", up: true, Icon: Check, tint: COLORS.successBg, iconColor: COLORS.success },
  { label: "Draft Recipes", value: "298", growth: "-2%", up: false, Icon: Edit3, bg: COLORS.warningBg, tint: COLORS.warningBg, iconColor: "#C97C1E" },
  { label: "Average Rating", value: "4.8", growth: "+0.3%", up: true, Icon: Star, tint: COLORS.pendingBg, iconColor: "#B8860B" },
];

const CATEGORY_OPTIONS = ["All Categories", "Breakfast", "Lunch", "Dinner", "Desserts", "Healthy"];
const STATUS_OPTIONS = ["All Status", "Published", "Draft", "Pending", "Archived"];
const DIFFICULTY_OPTIONS = ["All Difficulty", "Easy", "Medium", "Hard"];
const SORT_OPTIONS = ["Newest First", "Oldest First", "Top Rated", "A-Z"];

const RECIPES = [
  {
    name: "Creamy Alfredo Pasta",
    author: "Emily Carter",
    category: "Dinner",
    difficulty: "Medium",
    time: "35 mins",
    rating: 4.9,
    status: "Published",
    date: "Jul 21, 2026",
    img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Chicken Biryani",
    author: "Priya Shah",
    category: "Dinner",
    difficulty: "Hard",
    time: "70 mins",
    rating: 4.8,
    status: "Published",
    date: "Jul 20, 2026",
    img: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Classic Momo",
    author: "Raj Thapa",
    category: "Lunch",
    difficulty: "Medium",
    time: "50 mins",
    rating: 4.7,
    status: "Pending",
    date: "Jul 19, 2026",
    img: "https://images.unsplash.com/photo-1626804475297-411739d40f04?w=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Veg Pizza",
    author: "Alex Moreno",
    category: "Dinner",
    difficulty: "Easy",
    time: "40 mins",
    rating: 4.6,
    status: "Draft",
    date: "Jul 18, 2026",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Caesar Salad",
    author: "Noah Kim",
    category: "Healthy",
    difficulty: "Easy",
    time: "15 mins",
    rating: 4.5,
    status: "Published",
    date: "Jul 17, 2026",
    img: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Chocolate Cake",
    author: "Priya Shah",
    category: "Desserts",
    difficulty: "Medium",
    time: "55 mins",
    rating: 4.9,
    status: "Published",
    date: "Jul 16, 2026",
    img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Beef Burger",
    author: "Alex Moreno",
    category: "Lunch",
    difficulty: "Medium",
    time: "30 mins",
    rating: 4.6,
    status: "Archived",
    date: "Jul 15, 2026",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80&auto=format&fit=crop",
  },
];

const STATUS_STYLES = {
  Published: { bg: COLORS.successBg, color: COLORS.success },
  Draft: { bg: COLORS.warningBg, color: "#C97C1E" },
  Pending: { bg: COLORS.pendingBg, color: "#B8860B" },
  Archived: { bg: COLORS.archivedBg, color: COLORS.archived },
};

const QUICK_ACTIONS = [
  { label: "Add Recipe", desc: "Create a brand new recipe.", Icon: Plus },
  { label: "Manage Categories", desc: "Organize recipes into collections.", Icon: Folder },
  { label: "Review Drafts", desc: "Complete unfinished recipes.", Icon: Edit3 },
  { label: "Featured Recipes", desc: "Select recipes for homepage.", Icon: Star },
];

const POPULAR_CATEGORIES = [
  { name: "Breakfast", count: 120, pct: 70, Icon: ChefHat },
  { name: "Lunch", count: 98, pct: 58, Icon: BookOpen },
  { name: "Dinner", count: 156, pct: 90, Icon: ChefHat },
  { name: "Desserts", count: 82, pct: 48, Icon: Star },
  { name: "Healthy", count: 74, pct: 44, Icon: Check },
];

const RECENT_ACTIVITY = [
  { text: "Emily Carter published Creamy Alfredo Pasta", time: "2 min ago", Icon: Check, color: COLORS.success },
  { text: "Alex updated Chicken Biryani", time: "20 min ago", Icon: Edit3, color: COLORS.primary },
  { text: "Priya created Chocolate Cake", time: "1 hour ago", Icon: Plus, color: COLORS.primary },
  { text: "Raj deleted Old Pizza Recipe", time: "Yesterday", Icon: X, color: COLORS.danger },
];

const MOST_VIEWED = [
  { name: "Creamy Alfredo Pasta", value: "14.2k views" },
  { name: "Chicken Biryani", value: "11.6k views" },
  { name: "Chocolate Cake", value: "9.4k views" },
];
const TOP_RATED = [
  { name: "Creamy Alfredo Pasta", value: "4.9" },
  { name: "Chocolate Cake", value: "4.9" },
  { name: "Chicken Biryani", value: "4.8" },
];
const MOST_SAVED = [
  { name: "Caesar Salad", value: "3.6k saves" },
  { name: "Veg Pizza", value: "2.8k saves" },
  { name: "Classic Momo", value: "2.3k saves" },
];
const TRENDING_CATEGORIES = [
  { name: "Dinner", value: "+18%" },
  { name: "Desserts", value: "+11%" },
  { name: "Healthy", value: "+9%" },
];

/* ---------------------------------- Helpers ---------------------------------- */
function SectionHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4 mb-7">
      <div>
        {eyebrow && (
          <span
            className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-3"
            style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
          >
            {eyebrow}
          </span>
        )}
        <h2 style={{ ...displayFont, color: COLORS.dark }} className="text-2xl md:text-3xl font-bold">
          {title}
        </h2>
        {subtitle && (
          <p style={{ color: COLORS.secondary }} className="text-sm mt-2">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function Select({ options }) {
  return (
    <select
      className="w-full appearance-none rounded-2xl px-4 py-3 text-sm font-medium outline-none cursor-pointer transition-colors duration-200"
      style={{ backgroundColor: COLORS.bg, color: COLORS.dark, border: `1px solid ${COLORS.border}`, ...displayFont }}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

/* ---------------------------------- Main component ---------------------------------- */
export default function RecipePage({ onNavigate }) {
  const [active, setActive] = useState("Recipes");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNav = (link) => {
    setActive(link);
    if (onNavigate) onNavigate(link);
  };

  return (
    <div style={{ backgroundColor: COLORS.bg, ...bodyFont, color: COLORS.dark }} className="min-h-screen w-full overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes float1 { 0%,100% { transform: translateY(0) rotate(-4deg);} 50% { transform: translateY(-14px) rotate(2deg);} }
        @keyframes float2 { 0%,100% { transform: translateY(0) rotate(3deg);} 50% { transform: translateY(-18px) rotate(-3deg);} }
        @keyframes blobMove { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(16px,-24px) scale(1.06);} }
        @keyframes fadeUp { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform: translateY(0);} }
        .float-a { animation: float1 5s ease-in-out infinite; }
        .float-b { animation: float2 6s ease-in-out infinite; }
        .blob { animation: blobMove 10s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.6s ease both; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        select option { color: ${COLORS.dark}; }
        @media (prefers-reduced-motion: reduce) {
          .float-a, .float-b, .blob, .fade-up { animation: none !important; }
        }
      `}</style>

      {/* ---------------- Top Navbar ---------------- */}
      <header
        className="sticky top-0 z-50"
        style={{ backgroundColor: "rgba(250,248,245,0.92)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 flex items-center justify-between h-18 py-3">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setSidebarOpen((v) => !v)} aria-label="Toggle menu">
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-sm"
                style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
              >
                <ChefHat size={22} color="#fff" />
              </div>
              <span style={{ ...displayFont, color: COLORS.dark }} className="text-xl font-bold tracking-tight">
                CookCraft
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {TOP_NAV.map((link) => (
              <button
                key={link}
                onClick={() => handleNav(link)}
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: active === link ? COLORS.primaryDark : COLORS.secondary, ...displayFont }}
              >
                {link}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              aria-label="Search"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: COLORS.cream }}
            >
              <Search size={18} color={COLORS.primaryDark} />
            </button>
            <button
              aria-label="Notifications"
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: COLORS.cream }}
            >
              <Bell size={18} color={COLORS.primaryDark} />
              <span
                className="absolute top-1.5 right-2 w-2 h-2 rounded-full"
                style={{ backgroundColor: COLORS.danger, border: `1.5px solid ${COLORS.cream}` }}
              />
            </button>
            <div className="flex items-center gap-2 pl-1">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: COLORS.border }}>
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80&auto=format&fit=crop"
                  alt="Admin avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span style={{ ...displayFont, color: COLORS.dark }} className="hidden md:inline text-sm font-semibold">
                Account
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 pt-8">
        <main className="flex-1 min-w-0 pb-20">
          {/* ---------------- Hero ---------------- */}
          <section
            className="relative rounded-[32px] overflow-hidden mb-10 fade-up"
            style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
          >
            <div
              className="blob absolute rounded-full opacity-60 pointer-events-none"
              style={{ width: 220, height: 220, backgroundColor: COLORS.cream, filter: "blur(46px)", top: "-60px", left: "-40px" }}
            />
            <div
              className="blob absolute rounded-full opacity-40 pointer-events-none"
              style={{ width: 180, height: 180, backgroundColor: COLORS.warningBg, filter: "blur(46px)", bottom: "-50px", right: "18%", animationDelay: "3s" }}
            />
            <div className="relative z-10 grid md:grid-cols-[1.3fr,1fr] gap-8 items-center px-7 md:px-12 py-10 md:py-14">
              <div>
                <span
                  className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-5"
                  style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
                >
                  Recipe Management
                </span>
                <h1 style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                  Manage Your <span style={{ color: COLORS.primary }}>Recipes</span>
                </h1>
                <p style={{ color: COLORS.secondary }} className="text-base leading-relaxed max-w-md mb-7">
                  Create, edit, organize and publish recipes for the CookCraft community.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 flex items-center gap-2"
                    style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
                  >
                    <Plus size={16} strokeWidth={2.5} /> Add Recipe
                  </button>
                  <button
                    className="px-6 py-3 rounded-full text-sm font-semibold border transition-transform duration-200 hover:scale-105 flex items-center gap-2"
                    style={{ borderColor: COLORS.border, color: COLORS.dark, backgroundColor: COLORS.bg, ...displayFont }}
                  >
                    <Upload size={16} /> Import Recipes
                  </button>
                </div>
              </div>

              <div className="relative hidden md:flex items-center justify-center h-64">
                <div className="relative w-60 h-60 shrink-0">
                  <div className="w-full h-full rounded-full overflow-hidden shadow-xl border-8" style={{ borderColor: COLORS.bg }}>
                    <img
                      src="https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80&auto=format&fit=crop"
                      alt="Featured recipe"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {[
                    { emoji: "🍅", top: "-6%", left: "-6%", cls: "float-a", delay: "0s" },
                    { emoji: "🌿", top: "62%", left: "-10%", cls: "float-b", delay: "0.6s" },
                    { emoji: "🧄", top: "82%", left: "78%", cls: "float-a", delay: "1.2s" },
                    { emoji: "🧀", top: "-8%", left: "76%", cls: "float-b", delay: "0.3s" },
                  ].map((ing, i) => (
                    <div
                      key={i}
                      className={`absolute ${ing.cls} flex items-center justify-center w-11 h-11 rounded-2xl shadow-lg text-lg`}
                      style={{ top: ing.top, left: ing.left, backgroundColor: COLORS.card, animationDelay: ing.delay }}
                    >
                      {ing.emoji}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- Statistics ---------------- */}
          <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {STATS.map(({ label, value, growth, up, Icon, tint, iconColor }) => (
              <div
                key={label}
                className="rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: tint }}>
                    <Icon size={22} color={iconColor} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: up ? COLORS.successBg : "#FCEAEA",
                      color: up ? COLORS.success : COLORS.danger,
                      ...displayFont,
                    }}
                  >
                    {growth}
                  </span>
                </div>
                <span style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-4xl font-bold block">
                  {value}
                </span>
                <p style={{ color: COLORS.secondary }} className="text-sm mt-1">
                  {label}
                </p>
              </div>
            ))}
          </section>

          {/* ---------------- Search & Filter ---------------- */}
          <section
            className="rounded-3xl p-6 md:p-7 mb-10 shadow-sm"
            style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1 min-w-[220px]">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2" color={COLORS.secondary} />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-colors duration-200"
                  style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.dark, ...bodyFont }}
                />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:w-[560px]">
                <Select options={CATEGORY_OPTIONS} />
                <Select options={STATUS_OPTIONS} />
                <Select options={DIFFICULTY_OPTIONS} />
                <Select options={SORT_OPTIONS} />
              </div>
              <div className="flex gap-3">
                <button
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-semibold transition-colors duration-200 whitespace-nowrap"
                  style={{ border: `1px solid ${COLORS.border}`, color: COLORS.dark, backgroundColor: COLORS.bg, ...displayFont }}
                >
                  <RotateCcw size={16} /> Reset
                </button>
                <button
                  className="px-6 py-3 rounded-2xl text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 whitespace-nowrap"
                  style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
                >
                  Search
                </button>
              </div>
            </div>
          </section>

          {/* ---------------- Recipe Table ---------------- */}
          <section className="mb-10">
            <SectionHeading
              title="All Recipes"
              subtitle="Manage every recipe created by your community."
              action={
                <button style={{ color: COLORS.primaryDark, ...displayFont }} className="text-sm font-semibold">
                  View All
                </button>
              }
            />
            <div className="rounded-3xl shadow-sm overflow-hidden" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              {/* header row - desktop only */}
              <div
                className="hidden lg:grid px-7 py-4 text-xs font-semibold"
                style={{
                  color: COLORS.secondary,
                  borderBottom: `1px solid ${COLORS.border}`,
                  gridTemplateColumns: "2.4fr 1fr 1fr 0.9fr 0.9fr 0.9fr 1.1fr",
                  ...displayFont,
                }}
              >
                <span>Recipe</span>
                <span>Category</span>
                <span>Difficulty</span>
                <span>Time</span>
                <span>Rating</span>
                <span>Status</span>
                <span>Created</span>
              </div>
              {RECIPES.map((r, i) => (
                <div
                  key={r.name}
                  className="flex lg:grid items-center gap-4 md:gap-5 px-5 md:px-7 py-5 flex-wrap lg:flex-nowrap"
                  style={{
                    borderBottom: i !== RECIPES.length - 1 ? `1px solid ${COLORS.border}` : "none",
                    gridTemplateColumns: "2.4fr 1fr 1fr 0.9fr 0.9fr 0.9fr 1.1fr",
                  }}
                >
                  <div className="flex items-center gap-4 min-w-[180px]">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                      <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h4 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-sm mb-1 truncate">
                        {r.name}
                      </h4>
                      <p style={{ color: COLORS.secondary }} className="text-xs">
                        by {r.author}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full inline-block w-fit"
                    style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
                  >
                    {r.category}
                  </span>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full inline-block w-fit hidden sm:inline-block"
                    style={{ backgroundColor: COLORS.bg, color: COLORS.dark, border: `1px solid ${COLORS.border}`, ...displayFont }}
                  >
                    {r.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.secondary }}>
                    <Clock size={13} /> {r.time}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: COLORS.dark }}>
                    <Star size={14} fill={COLORS.primary} color={COLORS.primary} /> {r.rating}
                  </span>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full inline-block w-fit"
                    style={{ backgroundColor: STATUS_STYLES[r.status].bg, color: STATUS_STYLES[r.status].color, ...displayFont }}
                  >
                    {r.status}
                  </span>
                  <div className="flex items-center justify-between gap-3 flex-1 lg:flex-none">
                    <span className="text-xs hidden md:inline" style={{ color: COLORS.secondary }}>
                      {r.date}
                    </span>
                    <button aria-label="More options" className="p-2 rounded-full transition-colors duration-200" style={{ color: COLORS.secondary }}>
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- Quick Recipe Actions ---------------- */}
          <section className="mb-10">
            <SectionHeading title="Quick Recipe Actions" subtitle="Jump straight into your most common recipe tasks." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {QUICK_ACTIONS.map(({ label, desc, Icon }) => (
                <button
                  key={label}
                  className="text-left rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
                  >
                    <Icon size={20} color="#fff" strokeWidth={2.5} />
                  </div>
                  <h3 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-sm mb-1.5">
                    {label}
                  </h3>
                  <p style={{ color: COLORS.secondary }} className="text-xs leading-relaxed">
                    {desc}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* ---------------- Popular Categories ---------------- */}
          <section className="mb-10">
            <SectionHeading title="Popular Categories" subtitle="How your recipes are distributed across the menu." />
            <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-2">
              {POPULAR_CATEGORIES.map(({ name, count, pct, Icon }) => (
                <div
                  key={name}
                  className="flex-none w-56 rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: COLORS.cream }}>
                    <Icon size={22} color={COLORS.primary} />
                  </div>
                  <h4 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-sm mb-1">
                    {name}
                  </h4>
                  <p style={{ color: COLORS.secondary }} className="text-xs mb-3">
                    {count} Recipes
                  </p>
                  <div className="w-full h-2 rounded-full" style={{ backgroundColor: COLORS.bg }}>
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${pct}%`, backgroundImage: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- Recent Activity ---------------- */}
          <section className="mb-10">
            <SectionHeading title="Recent Activity" subtitle="Recent recipe updates from your community." />
            <div className="rounded-3xl p-6 md:p-7 shadow-sm" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <div className="flex flex-col gap-5">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: COLORS.bg }}
                    >
                      <a.Icon size={16} color={a.color} />
                    </div>
                    <p style={{ color: COLORS.dark }} className="text-sm flex-1">
                      {a.text}
                    </p>
                    <span style={{ color: COLORS.secondary }} className="text-xs whitespace-nowrap">
                      {a.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ---------------- Analytics ---------------- */}
          <section>
            <SectionHeading title="Analytics" subtitle="A quick pulse on what's resonating with cooks." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: "Most Viewed Recipes", Icon: Eye, data: MOST_VIEWED },
                { title: "Top Rated Recipes", Icon: Star, data: TOP_RATED },
                { title: "Most Saved Recipes", Icon: Bookmark, data: MOST_SAVED },
                { title: "Trending Categories", Icon: TrendingUp, data: TRENDING_CATEGORIES },
              ].map(({ title, Icon, data }) => (
                <div
                  key={title}
                  className="rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ backgroundColor: COLORS.cream }}>
                      <Icon size={18} color={COLORS.primary} />
                    </div>
                    <h4 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-sm">
                      {title}
                    </h4>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {data.map((d, i) => (
                      <div key={d.name} className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="text-xs font-semibold w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                            style={{ backgroundColor: COLORS.bg, color: COLORS.secondary, ...displayFont }}
                          >
                            {i + 1}
                          </span>
                          <span style={{ color: COLORS.dark }} className="text-xs font-medium truncate">
                            {d.name}
                          </span>
                        </div>
                        <span style={{ color: COLORS.secondary }} className="text-xs shrink-0">
                          {d.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* ---------------- Floating Action Button ---------------- */}
      <div className="fixed bottom-8 right-8 z-40 group">
        <button
          aria-label="Add New Recipe"
          className="w-14 h-14 rounded-full flex items-center justify-center shadow-xl text-white transition-transform duration-200 hover:scale-110"
          style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>
        <span
          className="absolute bottom-full right-0 mb-2 whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{ backgroundColor: COLORS.dark, color: "#fff", ...displayFont }}
        >
          Add New Recipe
        </span>
      </div>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span style={{ ...displayFont, color: COLORS.dark }} className="text-sm font-semibold">
            CookCraft Admin Dashboard
          </span>
          <span style={{ color: COLORS.secondary }} className="text-xs">
            © 2026 CookCraft · Recipe Management System
          </span>
        </div>
      </footer>
    </div>
  );
}
