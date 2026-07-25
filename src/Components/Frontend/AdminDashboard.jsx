import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MagnifyingGlass as Search,
  Bell,
  List as Menu,
  X,
  Clock,
  Star,
  DotsThreeVertical as DotsVertical,
  Check,
  Leaf,
  CookingPot as Soup,
  Coffee,
  Hamburger as Sandwich,
  Cookie,
  ForkKnife as ChefHat,
  Plus,
  FolderSimplePlus as FolderPlus,
  UsersThree as Users,
  ChartLineUp as ChartLine,
  SquaresFour as Grid,
  BookOpen,
  Gear as Settings,
  SignOut,
  Trophy,
  Eye,
  BookmarkSimple as Bookmark,
  UserCircle,
} from "phosphor-react";

/* ---------------------------------- Design tokens (shared with homepage) ---------------------------------- */
const COLORS = {
  bg: "#FAF8F5",
  primary: "#F38D39",
  primaryDark: "#D96F1B",
  dark: "#2D2D2D",
  secondary: "#6B7280",
  card: "#FFFFFF",
  border: "#F3E8D9",
  cream: "#FDF3E7",
  sage: "#EFF4EC",
  sageText: "#5C8A63",
  clay: "#F7E3D9",
  clayText: "#C25E3B",
  rose: "#FBE9EC",
  roseText: "#C2495E",
};

const displayFont = { fontFamily: "'Poppins', sans-serif" };
const bodyFont = { fontFamily: "'Inter', sans-serif" };

/* ---------------------------------- Data ---------------------------------- */
const TOP_NAV = ["Dashboard", "Recipes", "Categories", "Users"];

const STATS = [
  {
    label: "Total Recipes",
    value: 512,
  
    Icon: BookOpen,
    tint: COLORS.cream,
    iconColor: COLORS.primary,
    spark: [4, 6, 5, 8, 7, 9, 12],
    sparkColor: COLORS.primary,
  },
  {
    label: "Registered Users",
    value: 5240,
    Icon: Users,
    tint: COLORS.sage,
    iconColor: COLORS.sageText,
    spark: [3, 4, 6, 5, 7, 10, 11],
    sparkColor: COLORS.sageText,
  },
  {
    label: "Categories",
    value: 108,
    Icon: FolderPlus,
    tint: COLORS.clay,
    iconColor: COLORS.clayText,
    spark: [6, 6, 7, 6, 8, 8, 9],
    sparkColor: COLORS.clayText,
  },
  {
    label: "Average Rating",
    value: 4.8,
    Icon: Star,
    tint: COLORS.rose,
    iconColor: COLORS.roseText,
    spark: [4, 5, 4, 6, 6, 7, 8],
    sparkColor: COLORS.roseText,
    isDecimal: true,
  },
];

const QUICK_ACTIONS = [
  { label: "Add Recipe", desc: "Share a new dish with the community", Icon: Plus },
  { label: "Add Category", desc: "Organize recipes into fresh collections", Icon: FolderPlus },
  { label: "Manage Users", desc: "Review member accounts and roles", Icon: Users },
  { label: "Featured Recipes", desc: "Curate what appears on the homepage", Icon: Star },
];

const LATEST_RECIPES = [
  {
    name: "Golden Avocado Toast",
    author: "Emily Carter",
    category: "Breakfast",
    status: "Published",
    rating: 4.8,
    date: "Jul 21, 2026",
    img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Rustic Garlic Pasta",
    author: "Alex Moreno",
    category: "Dinner",
    status: "Published",
    rating: 4.9,
    date: "Jul 20, 2026",
    img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Smoky Beef Burger",
    author: "Priya Shah",
    category: "Lunch",
    status: "Draft",
    rating: 4.6,
    date: "Jul 19, 2026",
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80&auto=format&fit=crop",
  },
  {
    name: "Berry Yogurt Parfait",
    author: "Noah Kim",
    category: "Desserts",
    status: "Published",
    rating: 4.7,
    date: "Jul 18, 2026",
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200&q=80&auto=format&fit=crop",
  },
];

const STATUS_STYLES = {
  Published: { bg: COLORS.sage, color: COLORS.sageText },
  Draft: { bg: COLORS.cream, color: COLORS.primaryDark },
  Pending: { bg: COLORS.rose, color: COLORS.roseText },
};

const CATEGORIES_PROGRESS = [
  { name: "Breakfast", count: 84, pct: 74, Icon: Coffee, tint: COLORS.cream, iconColor: COLORS.primary },
  { name: "Lunch", count: 112, pct: 88, Icon: Sandwich, tint: COLORS.sage, iconColor: COLORS.sageText },
  { name: "Dinner", count: 96, pct: 80, Icon: Soup, tint: COLORS.clay, iconColor: COLORS.clayText },
  { name: "Desserts", count: 73, pct: 62, Icon: Cookie, tint: COLORS.rose, iconColor: COLORS.roseText },
  { name: "Healthy", count: 67, pct: 55, Icon: Leaf, tint: COLORS.sage, iconColor: COLORS.sageText },
];

const MOST_VIEWED = [
  { name: "Classic Margherita Pizza", value: "12.4k views" },
  { name: "Herb Roasted Chicken", value: "9.8k views" },
  { name: "Golden Avocado Toast", value: "8.1k views" },
];

const TOP_RATED = [
  { name: "Classic Margherita Pizza", value: "5.0" },
  { name: "Rustic Garlic Pasta", value: "4.9" },
  { name: "Smoky Beef Burger", value: "4.9" },
];

const MOST_SAVED = [
  { name: "Fresh Garden Salad", value: "3.2k saves" },
  { name: "Chocolate Lava Cake", value: "2.9k saves" },
  { name: "Cinnamon Waffles", value: "2.4k saves" },
];

const MOST_ACTIVE_USERS = [
  { name: "Emily Carter", value: "24 recipes" },
  { name: "Alex Moreno", value: "19 recipes" },
  { name: "Priya Shah", value: "16 recipes" },
];

const FLOATING_INGREDIENTS = [
  { emoji: "🍅", top: "10%", left: "2%", delay: "0s" },
  { emoji: "🌿", top: "68%", left: "-2%", delay: "0.6s" },
  { emoji: "🧄", top: "78%", left: "62%", delay: "1.2s" },
  { emoji: "🧀", top: "4%", left: "70%", delay: "0.3s" },
];

/* ---------------------------------- Helpers ---------------------------------- */
function useInView(threshold = 0.3) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

function Counter({ target, inView, isDecimal }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const duration = 1400;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return (
    <span style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-4xl font-bold">
      {isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString()}
    </span>
  );
}

function Sparkline({ points, color }) {
  const max = Math.max(...points);
  const min = Math.min(...points);
  const w = 100;
  const h = 32;
  const step = w / (points.length - 1);
  const coords = points.map((p, i) => {
    const x = i * step;
    const y = h - ((p - min) / (max - min || 1)) * (h - 4) - 2;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-8" preserveAspectRatio="none">
      <polyline
        points={coords.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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

/* ---------------------------------- Main component ---------------------------------- */
export default function CookCraftDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);

  return (
    <div style={{ backgroundColor: COLORS.bg, ...bodyFont, color: COLORS.dark }} className="min-h-screen w-full overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

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
                onClick={() => setActive(link)}
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
                style={{ backgroundColor: COLORS.roseText, border: `1.5px solid ${COLORS.cream}` }}
              />
            </button>
            <div className="flex items-center gap-2 pl-1">
              <div
                className="w-10 h-10 rounded-full overflow-hidden border-2"
                style={{ borderColor: COLORS.border }}
              >
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80&auto=format&fit=crop"
                  alt="Admin avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span style={{ ...displayFont, color: COLORS.dark }} className="hidden md:inline text-sm font-semibold">
                Chef Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 pt-8">
        {/* ---------------- Main content ---------------- */}
        <main className="flex-1 min-w-0 pb-20">
          {/* ---------------- Welcome hero ---------------- */}
          <section className="relative max-w-7xl mx-auto px-5 md:px-8 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-14 items-center overflow-hidden">
        {/* decorative blobs */}
        <div
          className="blob absolute rounded-full opacity-60 pointer-events-none"
          style={{ width: 280, height: 280, backgroundColor: COLORS.cream, filter: "blur(50px)", top: "-60px", left: "-80px", zIndex: 0 }}
        />
        <div
          className="blob absolute rounded-full opacity-50 pointer-events-none"
          style={{ width: 220, height: 220, backgroundColor: COLORS.sage, filter: "blur(50px)", bottom: "-40px", right: "10%", animationDelay: "3s", zIndex: 0 }}
        />

        <div className="relative z-10 fade-up">
          <span
            className="inline-block text-xs font-semibold px-4 py-1.5 rounded-full mb-6"
            style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
          >
            Cook. Save. Savor.
          </span>
          <h1 style={{ ...displayFont, color: COLORS.dark }} className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Discover, Cook &amp; Share
            <br />
            <span style={{ color: COLORS.primary }}>Amazing Recipes</span>
          </h1>
          <p style={{ color: COLORS.secondary }} className="text-base md:text-lg leading-relaxed mb-9 max-w-md">
            Browse hundreds of delicious recipes, organize your favorites, manage ingredients, and cook with confidence.
          </p>
          <div className="flex flex-wrap gap-4">
            <button
                    className="px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 flex items-center gap-2"
                    style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
                     onClick={() =>navigate("/admin/add-recipe")}
                  >
                    <Plus size={16} weight="bold" /> Add Recipe
                  </button>
                  <button
                    className="px-6 py-3 rounded-full text-sm font-semibold border transition-transform duration-200 hover:scale-105"
                    style={{ borderColor: COLORS.border, color: COLORS.dark, backgroundColor: COLORS.bg, ...displayFont }}
                  >
                    View Reports
                  </button>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-[380px] md:h-[460px]">
          <div
            className="spin-slow absolute rounded-full"
            style={{ width: 320, height: 320, border: `2px dashed ${COLORS.border}` }}
          />
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden shadow-xl border-8" style={{ borderColor: COLORS.card }}>
            <img
              src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&q=80&auto=format&fit=crop"
              alt="Featured dish of the day"
              className="w-full h-full object-cover"
            />
          </div>

          {FLOATING_INGREDIENTS.map((ing, i) => (
            <div
              key={ing.label}
              className={`absolute ${i % 2 === 0 ? "float-a" : "float-b"} hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-2xl shadow-lg`}
              style={{ top: ing.top, left: ing.left, backgroundColor: COLORS.card, animationDelay: ing.delay }}
            >
              <span className="text-lg">{ing.emoji}</span>
              <span className="text-xs font-semibold" style={{ color: COLORS.dark, ...displayFont }}>
                {ing.label}
              </span>
            </div>
          ))}
        </div>
      </section>

          {/* ---------------- Statistics ---------------- */}
          <section ref={statsRef} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {STATS.map(({ label, value, Icon, tint, iconColor, spark, sparkColor, isDecimal }) => (
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
                    style={{ backgroundColor: COLORS.sage, color: COLORS.sageText, ...displayFont }}
                  >
                  </span>
                </div>
                <Counter target={value} inView={statsInView} isDecimal={isDecimal} />
                <p style={{ color: COLORS.secondary }} className="text-sm mt-1">
                  {label}
                </p>
              </div>
            ))}
          </section>

          {/* ---------------- Quick Actions ---------------- */}
          <section className="mb-10">
            <SectionHeading title="Quick Actions" subtitle="Jump straight into your most common tasks." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {QUICK_ACTIONS.map(({ label, desc, Icon }) => (
                <button
                  key={label}
                  onClick={() => label === "Add Recipe" && navigate("/admin/add-recipe")}
                  className="text-left rounded-3xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
                  >
                    <Icon size={20} color="#fff" weight="bold" />
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

          {/* ---------------- Latest Recipes ---------------- */}
          <section className="mb-10">
            <SectionHeading
              title="Latest Recipes"
              subtitle="Newest submissions from the CookCraft community."
              action={
                <button style={{ color: COLORS.primaryDark, ...displayFont }} className="text-sm font-semibold">
                  View all
                </button>
              }
            />
            <div className="rounded-3xl shadow-sm overflow-hidden" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              {LATEST_RECIPES.map((r, i) => (
                <div
                  key={r.name}
                  className="flex items-center gap-4 md:gap-6 px-5 md:px-7 py-5 flex-wrap"
                  style={{ borderBottom: i !== LATEST_RECIPES.length - 1 ? `1px solid ${COLORS.border}` : "none" }}
                >
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0">
                    <img src={r.img} alt={r.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-[160px] flex-1">
                    <h4 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-sm mb-1">
                      {r.name}
                    </h4>
                    <p style={{ color: COLORS.secondary }} className="text-xs">
                      by {r.author}
                    </p>
                  </div>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full hidden sm:inline-block"
                    style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
                  >
                    {r.category}
                  </span>
                  <span
                    className="text-xs font-semibold px-3 py-1 rounded-full"
                    style={{ backgroundColor: STATUS_STYLES[r.status].bg, color: STATUS_STYLES[r.status].color, ...displayFont }}
                  >
                    {r.status}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: COLORS.dark }}>
                    <Star size={14} weight="fill" color={COLORS.primary} /> {r.rating}
                  </span>
                  <span className="flex items-center gap-1 text-xs hidden md:flex" style={{ color: COLORS.secondary }}>
                    <Clock size={13} /> {r.date}
                  </span>
                  <button aria-label="More options" className="p-2 rounded-full transition-colors duration-200" style={{ color: COLORS.secondary }}>
                    <DotsVertical size={18} />
                  </button>
                </div>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}