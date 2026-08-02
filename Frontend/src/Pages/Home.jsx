import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MagnifyingGlass as Search,
  List as Menu,
  X,
  Clock,
  Star,
  BookmarkSimple as Bookmark,
  UploadSimple as Upload,
  Funnel as FilterIcon,
  Leaf,
  ArrowRight,
  CaretLeft as ChevronLeft,
  CaretRight as ChevronRight,
  FacebookLogo as Facebook,
  InstagramLogo as Instagram,
  TwitterLogo as Twitter,
  YoutubeLogo as Youtube,
  EnvelopeSimple as Mail,
  MapPin,
  Phone,
  Coffee,
  Hamburger as Sandwich,
  CookingPot as Soup,
  Cookie,
  Martini as GlassWater,
  ForkKnife as ChefHat,
  SignOut,
} from "phosphor-react";

/* ---------------------------------- Design tokens ---------------------------------- */
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
};

const displayFont = { fontFamily: "'Poppins', sans-serif" };
const bodyFont = { fontFamily: "'Inter', sans-serif" };

/* ---------------------------------- Data ---------------------------------- */
const NAV_LINKS = ["Home", "Recipes", "Categories", "Ingredients", "About", "Contact"];

const CATEGORIES = [
  { name: "Breakfast", count: 84, Icon: Coffee, tint: COLORS.cream, iconColor: COLORS.primary },
  { name: "Lunch", count: 112, Icon: Sandwich, tint: COLORS.sage, iconColor: COLORS.sageText },
  { name: "Dinner", count: 96, Icon: Soup, tint: COLORS.clay, iconColor: COLORS.clayText },
  { name: "Desserts", count: 73, Icon: Cookie, tint: COLORS.cream, iconColor: COLORS.primary },
  { name: "Drinks", count: 58, Icon: GlassWater, tint: COLORS.sage, iconColor: COLORS.sageText },
  { name: "Healthy Meals", count: 67, Icon: Leaf, tint: COLORS.clay, iconColor: COLORS.clayText },
];

const FEATURED_RECIPES = [
  {
    name: "Golden Avocado Toast",
    category: "Breakfast",
    time: "10 min",
    difficulty: "Easy",
    rating: 4.8,
    img: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Rustic Garlic Pasta",
    category: "Dinner",
    time: "25 min",
    difficulty: "Medium",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Fresh Garden Salad",
    category: "Healthy",
    time: "15 min",
    difficulty: "Easy",
    rating: 4.7,
    img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Smoky Beef Burger",
    category: "Lunch",
    time: "30 min",
    difficulty: "Medium",
    rating: 4.9,
    img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Classic Margherita Pizza",
    category: "Dinner",
    time: "40 min",
    difficulty: "Hard",
    rating: 5.0,
    img: "https://images.unsplash.com/photo-1548365328-9f547fb0953b?w=800&q=80&auto=format&fit=crop",
  },
  {
    name: "Berry Yogurt Parfait",
    category: "Desserts",
    time: "8 min",
    difficulty: "Easy",
    rating: 4.6,
    img: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80&auto=format&fit=crop",
  },
];

const LATEST_RECIPES = [
  { name: "Herb Roasted Chicken", time: "45 min", img: "https://images.unsplash.com/photo-1598515213692-5f252f1b04e1?w=600&q=80&auto=format&fit=crop" },
  { name: "Spiced Pumpkin Soup", time: "35 min", img: "https://images.unsplash.com/photo-1476718406336-bb5a9690ee2a?w=600&q=80&auto=format&fit=crop" },
  { name: "Citrus Salmon Bowl", time: "20 min", img: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=600&q=80&auto=format&fit=crop" },
  { name: "Cinnamon Waffles", time: "18 min", img: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=600&q=80&auto=format&fit=crop" },
  { name: "Thai Basil Noodles", time: "22 min", img: "https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=600&q=80&auto=format&fit=crop" },
  { name: "Chocolate Lava Cake", time: "28 min", img: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600&q=80&auto=format&fit=crop" },
];

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

const STATS = [
  { label: "Recipes", value: 500, suffix: "+" },
  { label: "Categories", value: 100, suffix: "+" },
  { label: "Ingredients", value: 1000, suffix: "+" },
  { label: "Happy Users", value: 5000, suffix: "+" },
];

const FLOATING_INGREDIENTS = [
  { label: "Tomato", emoji: "🍅", top: "6%", left: "-6%", delay: "0s" },
  { label: "Basil", emoji: "🌿", top: "62%", left: "-10%", delay: "0.6s" },
  { label: "Garlic", emoji: "🧄", top: "80%", left: "58%", delay: "1.2s" },
  { label: "Cheese", emoji: "🧀", top: "2%", left: "62%", delay: "0.3s" },
  { label: "Herbs", emoji: "🌱", top: "38%", left: "84%", delay: "0.9s" },
];

/* ---------------------------------- Small helpers ---------------------------------- */
function DifficultyBadge({ level }) {
  const map = {
    Easy: { bg: COLORS.sage, color: COLORS.sageText },
    Medium: { bg: COLORS.cream, color: COLORS.primaryDark },
    Hard: { bg: COLORS.clay, color: COLORS.clayText },
  };
  const s = map[level] || map.Easy;
  return (
    <span
      className="text-xs font-semibold px-3 py-1 rounded-full"
      style={{ backgroundColor: s.bg, color: s.color, ...displayFont }}
    >
      {level}
    </span>
  );
}

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

function Counter({ target, suffix, inView }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const duration = 1600;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);
  return (
    <span style={{ ...displayFont, color: COLORS.dark }} className="text-4xl md:text-5xl font-bold">
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------------------------------- Main component ---------------------------------- */
export default function CookCraftHome() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/", { replace: true });
  }
  const [scrolled, setScrolled] = useState(false);
  const [statsRef, statsInView] = useInView(0.3);
  const carouselRef = useRef(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollCarousel = useCallback((dir) => {
    const el = carouselRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * 320, behavior: "smooth" });
  }, []);

  return (
    <div style={{ backgroundColor: COLORS.bg, ...bodyFont, color: COLORS.dark }} className="min-h-screen w-full overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes float1 { 0%,100% { transform: translateY(0) rotate(-4deg);} 50% { transform: translateY(-16px) rotate(2deg);} }
        @keyframes float2 { 0%,100% { transform: translateY(0) rotate(3deg);} 50% { transform: translateY(-22px) rotate(-3deg);} }
        @keyframes spinSlow { from { transform: rotate(0deg);} to { transform: rotate(360deg);} }
        @keyframes blobMove { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(20px,-30px) scale(1.08);} }
        @keyframes fadeUp { from { opacity:0; transform: translateY(18px);} to { opacity:1; transform: translateY(0);} }

        .float-a { animation: float1 5s ease-in-out infinite; }
        .float-b { animation: float2 6s ease-in-out infinite; }
        .spin-slow { animation: spinSlow 40s linear infinite; }
        .blob { animation: blobMove 10s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.7s ease both; }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @media (prefers-reduced-motion: reduce) {
          .float-a, .float-b, .spin-slow, .blob, .fade-up { animation: none !important; }
        }
      `}</style>

      {/* ---------------- Navbar ---------------- */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "shadow-md" : ""}`}
        style={{ backgroundColor: "rgba(250,248,245,0.9)", backdropFilter: "blur(10px)", borderBottom: `1px solid ${COLORS.border}` }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 flex items-center justify-between h-18 py-3">
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

          <nav className="hidden lg:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-medium transition-colors duration-200"
                style={{ color: COLORS.secondary, ...displayFont }}
                onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
                onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.secondary)}
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <button
              aria-label="Search"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
              style={{ backgroundColor: COLORS.cream }}
            >
              <Search size={18} color={COLORS.primaryDark} />
            </button>
            <span
              className="text-sm font-semibold hidden lg:inline"
              style={{ color: COLORS.dark, ...displayFont }}
            >
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
          <div className="md:hidden px-5 pb-5 flex flex-col gap-4 fade-up" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            {NAV_LINKS.map((link) => (
              <a key={link} href="#" className="text-sm font-medium pt-3" style={{ color: COLORS.dark, ...displayFont }}>
                {link}
              </a>
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

      {/* ---------------- Hero ---------------- */}
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
              className="px-7 py-3.5 rounded-full text-white font-semibold shadow-md transition-transform duration-200 hover:scale-105 flex items-center gap-2"
              style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
            >
              Explore Recipes <ArrowRight size={18} />
            </button>
            <button
              className="px-7 py-3.5 rounded-full font-semibold border transition-transform duration-200 hover:scale-105"
              style={{ borderColor: COLORS.border, color: COLORS.dark, backgroundColor: COLORS.card, ...displayFont }}
            >
              Add Recipe
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

      {/* ---------------- Categories ---------------- */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-4xl font-bold mb-3">
            Recipe Categories
          </h2>
          <p style={{ color: COLORS.secondary }} className="max-w-xl mx-auto">
            Find exactly what you're craving, organized the way you cook.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {CATEGORIES.map(({ name, count, Icon, tint, iconColor }) => (
            <div
              key={name}
              className="rounded-3xl p-6 text-center shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:-translate-y-1"
              style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300"
                style={{ backgroundColor: tint }}
              >
                <Icon size={26} color={iconColor} />
              </div>
              <h3 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-sm md:text-base mb-1">
                {name}
              </h3>
              <p style={{ color: COLORS.secondary }} className="text-xs">
                {count} recipes
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Featured Recipes ---------------- */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="text-center mb-12">
            <h2 style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-4xl font-bold mb-3">
              Featured Recipes
            </h2>
            <p style={{ color: COLORS.secondary }} className="max-w-xl mx-auto">
              Hand-picked favorites loved by the CookCraft community.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {FEATURED_RECIPES.map((r) => (
              <div
                key={r.name}
                className="rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                style={{ backgroundColor: COLORS.bg, border: `1px solid ${COLORS.border}` }}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <span
                    className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                    style={{ backgroundColor: "rgba(255,255,255,0.92)", color: COLORS.primaryDark, ...displayFont }}
                  >
                    {r.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-lg mb-3">
                    {r.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.secondary }}>
                      <Clock size={14} /> {r.time}
                    </span>
                    <DifficultyBadge level={r.difficulty} />
                    <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: COLORS.dark }}>
                      <Star size={14} fill={COLORS.primary} color={COLORS.primary} /> {r.rating}
                    </span>
                  </div>
                  <button
                    className="w-full py-2.5 rounded-full text-sm font-semibold text-white transition-transform duration-200 hover:scale-105"
                    style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
                  >
                    View Recipe
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Why Choose CookCraft ---------------- */}
      <section className="max-w-7xl mx-auto px-5 md:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h2 style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-4xl font-bold mb-3">
            Why Choose CookCraft
          </h2>
          <p style={{ color: COLORS.secondary }} className="max-w-xl mx-auto">
            Everything you need to plan, cook, and share great food.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-3xl p-7 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{
                backgroundColor: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(6px)",
                border: `1px solid ${COLORS.border}`,
              }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
              >
                <Icon size={22} color="#fff" />
              </div>
              <h3 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-lg mb-2">
                {title}
              </h3>
              <p style={{ color: COLORS.secondary }} className="text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Statistics ---------------- */}
      <section
        ref={statsRef}
        className="py-16 md:py-20"
        style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}0D, ${COLORS.sage}80)` }}
      >
        <div className="max-w-7xl mx-auto px-5 md:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <Counter target={s.value} suffix={s.suffix} inView={statsInView} />
              <p style={{ color: COLORS.secondary, ...displayFont }} className="mt-2 text-sm font-medium">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Latest Recipes Carousel ---------------- */}
      <section className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <h2 style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-4xl font-bold mb-2">
                Latest Recipes
              </h2>
              <p style={{ color: COLORS.secondary }}>Fresh off the CookCraft community.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => scrollCarousel(-1)}
                aria-label="Scroll left"
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: COLORS.cream }}
              >
                <ChevronLeft size={18} color={COLORS.primaryDark} />
              </button>
              <button
                onClick={() => scrollCarousel(1)}
                aria-label="Scroll right"
                className="w-11 h-11 rounded-full flex items-center justify-center shadow-sm transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: COLORS.cream }}
              >
                <ChevronRight size={18} color={COLORS.primaryDark} />
              </button>
            </div>
          </div>

          <div ref={carouselRef} className="flex gap-6 overflow-x-auto hide-scrollbar pb-2 scroll-smooth">
            {LATEST_RECIPES.map((r) => (
              <div
                key={r.name}
                className="flex-none w-64 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                style={{ border: `1px solid ${COLORS.border}` }}
              >
                <div className="h-40 overflow-hidden">
                  <img src={r.img} alt={r.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
                <div className="p-4" style={{ backgroundColor: COLORS.bg }}>
                  <h3 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-sm mb-1">
                    {r.name}
                  </h3>
                  <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.secondary }}>
                    <Clock size={13} /> {r.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Newsletter ---------------- */}
      <section className="px-5 md:px-8 py-16 md:py-20">
        <div
          className="max-w-5xl mx-auto rounded-[28px] px-8 py-14 md:py-16 text-center shadow-md relative overflow-hidden"
          style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
        >
          <div className="blob absolute rounded-full opacity-20 pointer-events-none" style={{ width: 220, height: 220, backgroundColor: "#fff", top: "-60px", right: "-40px" }} />
          <h2 style={{ ...displayFont }} className="text-3xl md:text-4xl font-bold text-white mb-3 relative z-10">
            Never Miss a Recipe!
          </h2>
          <p className="text-white/90 max-w-md mx-auto mb-8 relative z-10">
            Subscribe for weekly recipe drops, cooking tips, and seasonal favorites.
          </p>
          {subscribed ? (
            <p className="text-white font-semibold relative z-10">Thanks for subscribing — welcome aboard! 🎉</p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (email.trim()) setSubscribed(true);
              }}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-5 py-3.5 rounded-full outline-none text-sm"
                style={{ ...bodyFont }}
              />
              <button
                type="submit"
                className="px-6 py-3.5 rounded-full font-semibold text-sm transition-transform duration-200 hover:scale-105"
                style={{ backgroundColor: COLORS.dark, color: "#fff", ...displayFont }}
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer style={{ backgroundColor: COLORS.dark }} className="pt-16 pb-8 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
              >
                <ChefHat size={18} color="#fff" />
              </div>
              <span style={{ ...displayFont }} className="text-lg font-bold text-white">
                CookCraft
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-5">Cook. Save. Savor. Your everyday companion for recipes done right.</p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-200 hover:scale-110"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <Icon size={16} color="#fff" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 style={{ ...displayFont }} className="text-white font-semibold mb-4 text-sm tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ ...displayFont }} className="text-white font-semibold mb-4 text-sm tracking-wide">
              Categories
            </h4>
            <ul className="space-y-3">
              {CATEGORIES.slice(0, 5).map((c) => (
                <li key={c.name}>
                  <a href="#" className="text-sm text-white/60 hover:text-white transition-colors duration-200">
                    {c.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 style={{ ...displayFont }} className="text-white font-semibold mb-4 text-sm tracking-wide">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li className="flex items-center gap-2">
                <Mail size={15} /> hello@cookcraft.app
              </li>
              <li className="flex items-center gap-2">
                <Phone size={15} /> +1 (555) 012-3456
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={15} /> Kathmandu, Nepal
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 pt-6">© {new Date().getFullYear()} CookCraft. All rights reserved.</p>
      </footer>
    </div>
  );
}