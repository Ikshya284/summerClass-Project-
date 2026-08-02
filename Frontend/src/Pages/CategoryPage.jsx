import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Search,
  Bell,
  Menu,
  X,
  Clock,
  Star,
  MoreVertical,
  Plus,
  Folder,
  FolderEdit,
  ArrowRightLeft,
  RotateCcw,
  TrendingUp,
  Bookmark,
  Award,
  ChefHat,
  Eye,
} from "lucide-react";

/* ---------------------------------- Design tokens ---------------------------------- */
const COLORS = {
  bg: "#FAF8F5",
  primary: "#F38D39",
  primaryDark: "#D96F1B",
  green: "#A3E635",
  greenDark: "#65A30D",
  dark: "#262626",
  secondary: "#6B7280",
  card: "#FFFFFF",
  border: "#F0E4D7",
  cream: "#FDF3E7",
  greenBg: "#F1FAE3",
  success: "#4CAF50",
  successBg: "#EAF7EC",
  hiddenBg: "#F1F1F2",
  hiddenText: "#9CA3AF",
  danger: "#EF4444",
};

const displayFont = { fontFamily: "'Poppins', sans-serif" };
const bodyFont = { fontFamily: "'Poppins', sans-serif" };

/* ---------------------------------- Data ---------------------------------- */
const TOP_NAV = ["Dashboard", "Recipes", "Categories", "Users", "Analytics"];

const STATS = [
  { label: "Total Categories", value: "108", growth: "+5%", up: true, emoji: "🥘", tint: COLORS.cream },
  { label: "Most Popular", value: "Dinner", growth: "+12%", up: true, emoji: "🍽", tint: COLORS.greenBg },
  { label: "Recipes Assigned", value: "512", growth: "+8%", up: true, emoji: "📖", tint: COLORS.cream },
  { label: "Featured Categories", value: "18", growth: "+3%", up: true, emoji: "⭐", tint: COLORS.greenBg },
];

const SORT_OPTIONS = ["Recipe Count", "Alphabetical", "Recently Added"];
const VISIBILITY_OPTIONS = ["All", "Active", "Hidden"];

const CATEGORIES = [
  { name: "Breakfast", emoji: "🥞", count: 84, pct: 74, desc: "Morning meals and healthy breakfast ideas.", status: "Active", date: "Jan 12, 2026", img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&q=80&auto=format&fit=crop" },
  { name: "Lunch", emoji: "🍔", count: 112, pct: 88, desc: "Quick meals and lunch specials.", status: "Active", date: "Jan 18, 2026", img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&q=80&auto=format&fit=crop" },
  { name: "Dinner", emoji: "🍝", count: 96, pct: 82, desc: "Perfect dinner recipes.", status: "Active", date: "Feb 2, 2026", img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=300&q=80&auto=format&fit=crop" },
  { name: "Desserts", emoji: "🍰", count: 73, pct: 63, desc: "Sweet treats and baked goods.", status: "Active", date: "Feb 20, 2026", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&q=80&auto=format&fit=crop" },
  { name: "Healthy", emoji: "🥗", count: 67, pct: 57, desc: "Nutritious recipes.", status: "Active", date: "Mar 5, 2026", img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&q=80&auto=format&fit=crop" },
  { name: "Snacks", emoji: "🍟", count: 48, pct: 41, desc: "Fast and delicious snacks.", status: "Hidden", date: "Mar 22, 2026", img: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80&auto=format&fit=crop" },
  { name: "Drinks", emoji: "🥤", count: 42, pct: 36, desc: "Juices, smoothies and beverages.", status: "Active", date: "Apr 9, 2026", img: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80&auto=format&fit=crop" },
  { name: "International", emoji: "🌍", count: 95, pct: 81, desc: "Recipes from around the world.", status: "Active", date: "Apr 30, 2026", img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=80&auto=format&fit=crop" },
];

const STATUS_STYLES = {
  Active: { bg: COLORS.greenBg, color: COLORS.greenDark },
  Hidden: { bg: COLORS.hiddenBg, color: COLORS.hiddenText },
};

const QUICK_ACTIONS = [
  { label: "Add Category", desc: "Create a new category.", Icon: Plus },
  { label: "Edit Categories", desc: "Update category details.", Icon: FolderEdit },
  { label: "Assign Recipes", desc: "Move recipes into categories.", Icon: ArrowRightLeft },
  { label: "Featured Categories", desc: "Choose homepage categories.", Icon: Star },
];

const MOST_POPULAR = [
  { name: "Dinner", value: "96 recipes" },
  { name: "Lunch", value: "112 recipes" },
  { name: "International", value: "95 recipes" },
  { name: "Breakfast", value: "84 recipes" },
  { name: "Desserts", value: "73 recipes" },
];
const FASTEST_GROWING = [
  { name: "Healthy", value: "+22%" },
  { name: "International", value: "+17%" },
  { name: "Drinks", value: "+14%" },
];
const MOST_SAVED = [
  { name: "Dinner", value: "4.1k saves" },
  { name: "Desserts", value: "3.4k saves" },
  { name: "Breakfast", value: "2.9k saves" },
];
const HIGHEST_RATED = [
  { name: "International", value: "4.9" },
  { name: "Dinner", value: "4.8" },
  { name: "Healthy", value: "4.8" },
];

const RECENT_ACTIVITY = [
  { text: 'Emily created "Healthy"', time: "5 minutes ago", Icon: Plus, color: COLORS.greenDark },
  { text: 'Raj updated "Dinner"', time: "20 minutes ago", Icon: FolderEdit, color: COLORS.primary },
  { text: 'Alex deleted "Soups"', time: "Yesterday", Icon: X, color: COLORS.danger },
  { text: 'Priya added "Vegan"', time: "Yesterday", Icon: Plus, color: COLORS.greenDark },
];

const FEATURED_CATEGORIES = [
  { name: "Breakfast", count: 84, img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80&auto=format&fit=crop" },
  { name: "Healthy", count: 67, img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80&auto=format&fit=crop" },
  { name: "Desserts", count: 73, img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80&auto=format&fit=crop" },
  { name: "International", count: 95, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&q=80&auto=format&fit=crop" },
  { name: "Dinner", count: 96, img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80&auto=format&fit=crop" },
];

const DISTRIBUTION = [
  { name: "Breakfast", value: 84, color: "#F38D39" },
  { name: "Lunch", value: 112, color: "#A3E635" },
  { name: "Dinner", value: 96, color: "#D96F1B" },
  { name: "Desserts", value: 73, color: "#65A30D" },
  { name: "Healthy", value: 67, color: "#FBBF77" },
  { name: "Snacks", value: 48, color: "#C4E88A" },
  { name: "Drinks", value: 42, color: "#F0B27A" },
  { name: "International", value: 95, color: "#8CC63F" },
];

const FLOATING_ICONS = [
  { emoji: "🥞", top: "4%", left: "6%", cls: "float-a", delay: "0s" },
  { emoji: "🍝", top: "58%", left: "-4%", cls: "float-b", delay: "0.4s" },
  { emoji: "🥗", top: "72%", left: "70%", cls: "float-a", delay: "1s" },
  { emoji: "🍰", top: "0%", left: "70%", cls: "float-b", delay: "0.6s" },
];

const ILLUSTRATION_ICONS = [
  { emoji: "🥞", tint: COLORS.cream },
  { emoji: "🍝", tint: COLORS.greenBg },
  { emoji: "🥗", tint: COLORS.greenBg },
  { emoji: "🍰", tint: COLORS.cream },
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

function AnalyticsList({ title, Icon, data }) {
  return (
    <div
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
  );
}

/* ---------------------------------- Main component ---------------------------------- */
export default function CategorytPage({ onNavigate }) {
  const [active, setActive] = useState("Categories");
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
                Chef Rajin
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
              className="blob absolute rounded-full opacity-50 pointer-events-none"
              style={{ width: 180, height: 180, backgroundColor: COLORS.greenBg, filter: "blur(46px)", bottom: "-50px", right: "18%", animationDelay: "3s" }}
            />
            <div className="relative z-10 grid md:grid-cols-[1.3fr,1fr] gap-8 items-center px-7 md:px-12 py-10 md:py-14">
              <div>
                <span
                  className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-5"
                  style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
                >
                  Category Management
                </span>
                <h1 style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                  Organize Your <span style={{ color: COLORS.primary }}>Recipe Categories</span>
                </h1>
                <p style={{ color: COLORS.secondary }} className="text-base leading-relaxed max-w-md mb-7">
                  Create, edit, organize and manage recipe categories to keep CookCraft structured and easy to explore.
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    className="px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 flex items-center gap-2"
                    style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
                  >
                    <Plus size={16} strokeWidth={2.5} /> Add Category
                  </button>
                  <button
                    onClick={() => handleNav("Recipes")}
                    className="px-6 py-3 rounded-full text-sm font-semibold border transition-transform duration-200 hover:scale-105 flex items-center gap-2"
                    style={{ borderColor: COLORS.border, color: COLORS.dark, backgroundColor: COLORS.bg, ...displayFont }}
                  >
                    <Folder size={16} /> Manage Recipes
                  </button>
                </div>
              </div>

              {/* ---- Flat illustration ---- */}
              <div className="relative hidden md:flex items-center justify-center h-64">
                <div className="relative w-60 h-60 shrink-0">
                  <div
                    className="w-full h-full rounded-[40px] grid grid-cols-2 gap-3 p-4 shadow-xl border-8"
                    style={{ borderColor: COLORS.bg, backgroundColor: COLORS.card }}
                  >
                    {ILLUSTRATION_ICONS.map((ic, i) => (
                      <div
                        key={i}
                        className="rounded-2xl flex items-center justify-center text-4xl"
                        style={{ backgroundColor: ic.tint }}
                      >
                        {ic.emoji}
                      </div>
                    ))}
                  </div>
                  {FLOATING_ICONS.map((ing, i) => (
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
            {STATS.map(({ label, value, growth, up, emoji, tint }) => (
              <div
                key={label}
                className="rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: tint }}>
                    {emoji}
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: up ? COLORS.greenBg : "#FCEAEA",
                      color: up ? COLORS.greenDark : COLORS.danger,
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
                  placeholder="Search category..."
                  className="w-full rounded-2xl pl-11 pr-4 py-3 text-sm outline-none transition-colors duration-200"
                  style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.border}`, color: COLORS.dark, ...bodyFont }}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 lg:w-[360px]">
                <Select options={SORT_OPTIONS} />
                <Select options={VISIBILITY_OPTIONS} />
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

          {/* ---------------- Categories Grid ---------------- */}
          <section className="mb-10">
            <SectionHeading title="All Categories" subtitle="Manage every food category available in CookCraft." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {CATEGORIES.map((c) => (
                <div
                  key={c.name}
                  className="rounded-3xl p-5 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="relative rounded-2xl overflow-hidden h-28 mb-4">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                    <div
                      className="absolute -bottom-4 left-4 w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-md"
                      style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
                    >
                      {c.emoji}
                    </div>
                    <button
                      aria-label="More options"
                      className="absolute top-2 right-2 p-1.5 rounded-full transition-colors duration-200"
                      style={{ backgroundColor: "rgba(255,255,255,0.85)", color: COLORS.dark }}
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  <div className="pt-2 flex items-start justify-between gap-2 mb-1.5">
                    <h4 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-sm">
                      {c.name}
                    </h4>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{ backgroundColor: STATUS_STYLES[c.status].bg, color: STATUS_STYLES[c.status].color, ...displayFont }}
                    >
                      {c.status}
                    </span>
                  </div>
                  <p style={{ color: COLORS.secondary }} className="text-xs leading-relaxed mb-3">
                    {c.desc}
                  </p>
                  <div className="flex items-center justify-between text-xs mb-2" style={{ color: COLORS.secondary }}>
                    <span style={{ color: COLORS.dark }} className="font-semibold">
                      {c.count} Recipes
                    </span>
                    <span>{c.pct}% popularity</span>
                  </div>
                  <div className="w-full h-2 rounded-full mb-3" style={{ backgroundColor: COLORS.bg }}>
                    <div
                      className="h-2 rounded-full"
                      style={{ width: `${c.pct}%`, backgroundImage: `linear-gradient(90deg, ${COLORS.primary}, ${COLORS.green})` }}
                    />
                  </div>
                  <div className="flex items-center gap-1 text-[11px]" style={{ color: COLORS.secondary }}>
                    <Clock size={12} /> Added {c.date}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ---------------- Quick Actions ---------------- */}
          <section className="mb-10">
            <SectionHeading title="Quick Actions" subtitle="Jump straight into your most common category tasks." />
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

          {/* ---------------- Category Analytics ---------------- */}
          <section className="mb-10">
            <SectionHeading title="Category Analytics" subtitle="A quick pulse on how categories are performing." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <AnalyticsList title="Most Popular Categories" Icon={TrendingUp} data={MOST_POPULAR} />
              <AnalyticsList title="Fastest Growing" Icon={ArrowRightLeft} data={FASTEST_GROWING} />
              <AnalyticsList title="Most Saved Category" Icon={Bookmark} data={MOST_SAVED} />
              <AnalyticsList title="Highest Rated Category" Icon={Award} data={HIGHEST_RATED} />
            </div>
          </section>

          {/* ---------------- Recent Activity + Distribution ---------------- */}
          <section className="grid lg:grid-cols-[1.1fr,1fr] gap-5 mb-10">
            <div className="rounded-3xl p-6 md:p-7 shadow-sm" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <SectionHeading title="Recent Activity" subtitle="Latest changes made to your categories." />
              <div className="flex flex-col gap-5">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.bg }}>
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

            <div className="rounded-3xl p-6 md:p-7 shadow-sm" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <SectionHeading title="Category Distribution" subtitle="Share of recipes across all categories." />
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-44 h-44 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={DISTRIBUTION}
                        dataKey="value"
                        nameKey="name"
                        innerRadius="62%"
                        outerRadius="100%"
                        paddingAngle={2}
                        stroke="none"
                      >
                        {DISTRIBUTION.map((d, i) => (
                          <Cell key={i} fill={d.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: `1px solid ${COLORS.border}`, ...displayFont, fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 flex-1 w-full">
                  {DISTRIBUTION.map((d) => (
                    <div key={d.name} className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span style={{ color: COLORS.dark }} className="text-xs font-medium truncate">
                        {d.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ---------------- Featured Categories ---------------- */}
          <section>
            <SectionHeading title="Featured Categories" subtitle="Categories currently highlighted on the homepage." />
            <div className="flex gap-5 overflow-x-auto hide-scrollbar pb-2">
              {FEATURED_CATEGORIES.map((c) => (
                <div
                  key={c.name}
                  className="flex-none w-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300"
                  style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="relative h-36">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                    <span
                      className="absolute top-3 left-3 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"
                      style={{ backgroundColor: "rgba(255,255,255,0.9)", color: COLORS.primaryDark, ...displayFont }}
                    >
                      <Star size={11} fill={COLORS.primary} color={COLORS.primary} /> Featured
                    </span>
                  </div>
                  <div className="p-5">
                    <h4 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-sm mb-1">
                      {c.name}
                    </h4>
                    <p style={{ color: COLORS.secondary }} className="text-xs mb-4">
                      {c.count} Recipes
                    </p>
                    <button
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-colors duration-200"
                      style={{ border: `1px solid ${COLORS.border}`, color: COLORS.dark, backgroundColor: COLORS.bg, ...displayFont }}
                    >
                      <Eye size={14} /> View Category
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t" style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}>
        <div className="max-w-[1440px] mx-auto px-5 md:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span style={{ ...displayFont, color: COLORS.dark }} className="text-sm font-semibold">
            CookCraft Admin Dashboard
          </span>
          <span style={{ color: COLORS.secondary }} className="text-xs">
            © 2026 CookCraft · Recipe Category Management System
          </span>
        </div>
      </footer>
    </div>
  );
}
