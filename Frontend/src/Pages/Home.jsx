import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getRecipes } from "../services/recipeService";
import Navbar from "../Components/Navbar";
import {
  Clock,
  Star,
  Plus,
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
} from "phosphor-react";

// NOTE: update this path to point at wherever your hero video asset actually lives.
import heroDishVideo from "../Images/heroDish.mp4";

// Brand logo. Place logo.png next to this file (or update the path to match your assets folder).
import logo from "../Images/logo_img.png";



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
const NAV_LINKS = ["Home", "Recipes",  "About"];



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

const STATS = [
  { label: "Recipes", value: 500, suffix: "+" },

  { label: "Ingredients", value: 1000, suffix: "+" },
  { label: "Happy Users", value: 5000, suffix: "+" },
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
  const [featuredRecipes, setFeaturedRecipes] = useState(
    FEATURED_RECIPES.map((recipe, index) => ({ ...recipe, id: index + 1 }))
  );

  const [statsRef, statsInView] = useInView(0.3);
  const carouselRef = useRef(null);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Land on the right section when arriving via a Navbar link (e.g. /home#featured-recipes).
  useEffect(() => {
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    getRecipes({ search: "", difficulty: "All", category: "All" })
      .then((recipes) => {
        if (cancelled) return;
        if (Array.isArray(recipes) && recipes.length) {
          setFeaturedRecipes(
            recipes.slice(0, 6).map((recipe, index) => ({
              id: recipe.id ?? index + 1,
              name: recipe.title,
              category: recipe.category,
              time: recipe.cookingTime,
              difficulty: recipe.difficulty,
              rating: 4.8,
              img: recipe.imageUrl || recipe.images?.[0]?.url || FEATURED_RECIPES[index % FEATURED_RECIPES.length].img,
            }))
          );
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
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

      <Navbar />

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
              className="px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 flex items-center gap-2"
              style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
              onClick={() => navigate("/recipes")}
            >
              Explore Recipes
            </button>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-[380px] md:h-[460px]">
          <div className="spin-slow absolute rounded-full" style={{ width: 320, height: 320 }} />
          <div
            className="w-64 h-64 md:w-[28rem] md:h-[28rem] rounded-full overflow-hidden shadow-xl border-8"
            style={{ borderColor: COLORS.card }}
          >
            <video
              src={heroDishVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
              aria-label="Featured dish of the day"
            />
          </div>
        </div>
      </section>


      {/* ---------------- Featured Recipes ---------------- */}
      <section id="featured-recipes" className="py-16 md:py-20" style={{ backgroundColor: "#FFFFFF" }}>
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
            {featuredRecipes.map((r) => (
              <div
                key={r.id}
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
                    onClick={() => navigate(`/recipes/${r.id}`)}
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

      {/* ---------------- Footer ---------------- */}
      <footer style={{ backgroundColor: COLORS.dark }} className="pt-16 pb-8 px-5 md:px-8">
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12" style={{ borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src={logo} alt="CookCraft logo" className="h-9 w-auto object-contain" />
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




        </div>

        <p className="text-center text-xs text-white/40 pt-6">© {new Date().getFullYear()} CookCraft. All rights reserved.</p>
      </footer>
    </div>
  );
}
