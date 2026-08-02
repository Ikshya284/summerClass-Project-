import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MagnifyingGlass as Search,
  Bell,
  Heart,
  Plus,
  TrashSimple as Trash,
  CloudArrowUp as UploadCloud,
  Eye,
  Clock,
  Sparkle,
  BookmarkSimple as Bookmark,
  PaperPlaneRight as Send,
  ImageSquare,
  X,
  Leaf,
  ForkKnife as ChefHat,
  CaretDown,
  CheckCircle,
} from "phosphor-react";
import foodPlaceholder from "../../Images/food.png";
import { createRecipe } from "../../services/recipeService";

/* ---------------------------------- Design tokens (shared with the rest of the site) ---------------------------------- */
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

const inputClass =
  "w-full rounded-2xl px-4 py-3 text-sm bg-white outline-none transition-all duration-200 border focus:ring-2 focus:ring-[#F38D39]/25 focus:border-[#F38D39]";

/* ---------------------------------- Static option lists ---------------------------------- */
const CUISINES = ["Italian", "Mexican", "Indian", "Chinese", "Japanese", "Thai", "American", "French", "Mediterranean", "Other"];
const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Desserts", "Healthy", "Snacks", "Drinks"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const UNITS = ["g", "kg", "ml", "l", "tsp", "tbsp", "cup", "pcs", "oz", "lb", "pinch"];

const FLOATING_TAGS = [
  { label: "Tomato", emoji: "🍅", top: "6%", left: "-4%", delay: "0s" },
  { label: "Basil", emoji: "🌿", top: "70%", left: "-6%", delay: "0.6s" },
  { label: "Cheese", emoji: "🧀", top: "0%", left: "66%", delay: "0.3s" },
  { label: "Garlic", emoji: "🧄", top: "60%", left: "72%", delay: "0.9s" },
];

let idSeed = 0;
const nextId = () => `id-${Date.now()}-${idSeed++}`;

const emptyIngredient = () => ({ id: nextId(), name: "", quantity: "", unit: "pcs" });
const emptyStep = () => ({ id: nextId(), description: "", image: null });

/**
 * The shape below is the contract the future backend will expect. Keeping it
 * centralized here (rather than scattered across component state) means the
 * publish handler can be pointed at a real API without touching the form UI.
 */
const buildInitialRecipe = () => ({
  title: "",
  description: "",
  cuisine: "",
  category: "",
  cookingTime: "",
  difficulty: "",
  ingredients: [emptyIngredient()],
  instructions: [emptyStep()],
  images: [],
  createdBy: "Chef Rajin",
  createdAt: null,
});

/* ---------------------------------- Small shared UI pieces ---------------------------------- */
function Field({ label, required, className = "", children }) {
  return (
    <div className={className}>
      <label style={{ ...displayFont, color: COLORS.dark }} className="block text-sm font-semibold mb-2">
        {label} {required && <span style={{ color: COLORS.roseText }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputClass} appearance-none pr-10 cursor-pointer`}
        style={{ borderColor: COLORS.border, ...bodyFont, color: value ? COLORS.dark : COLORS.secondary }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <CaretDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" color={COLORS.secondary} />
    </div>
  );
}

function GhostButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-transform duration-200 hover:scale-105 shrink-0"
      style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
    >
      {children}
    </button>
  );
}

function IconButton({ onClick, tint, iconColor, children, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 hover:scale-105 shrink-0"
      style={{ backgroundColor: tint }}
    >
      {children}
    </button>
  );
}

function SectionCard({ number, title, action, tip, children }) {
  return (
    <section className="rounded-3xl p-6 md:p-7 shadow-sm" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-3">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
          >
            {number}
          </span>
          <h3 style={{ ...displayFont, color: COLORS.dark }} className="text-lg font-bold">
            {title}
          </h3>
        </div>
        {action}
      </div>
      {children}
      {tip && (
        <p className="text-xs mt-5 flex items-center gap-1.5" style={{ color: COLORS.sageText }}>
          <Leaf size={13} weight="fill" /> {tip}
        </p>
      )}
    </section>
  );
}

function Pill({ bg, color, children }) {
  return (
    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: bg, color, ...displayFont }}>
      {children}
    </span>
  );
}

/* ---------------------------------- Main component ---------------------------------- */
export default function AddRecipe() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [recipe, setRecipe] = useState(buildInitialRecipe());
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (field, value) => setRecipe((r) => ({ ...r, [field]: value }));

  /* ---- Ingredients ---- */
  const addIngredient = () => setRecipe((r) => ({ ...r, ingredients: [...r.ingredients, emptyIngredient()] }));
  const removeIngredient = (id) =>
    setRecipe((r) => ({
      ...r,
      ingredients: r.ingredients.length > 1 ? r.ingredients.filter((i) => i.id !== id) : r.ingredients,
    }));
  const updateIngredient = (id, field, value) =>
    setRecipe((r) => ({ ...r, ingredients: r.ingredients.map((i) => (i.id === id ? { ...i, [field]: value } : i)) }));

  /* ---- Instructions ---- */
  const addStep = () => setRecipe((r) => ({ ...r, instructions: [...r.instructions, emptyStep()] }));
  const removeStep = (id) =>
    setRecipe((r) => ({
      ...r,
      instructions: r.instructions.length > 1 ? r.instructions.filter((s) => s.id !== id) : r.instructions,
    }));
  const updateStep = (id, field, value) =>
    setRecipe((r) => ({ ...r, instructions: r.instructions.map((s) => (s.id === id ? { ...s, [field]: value } : s)) }));
  const setStepImage = (id, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateStep(id, "image", url);
  };

  /* ---- Recipe photos ---- */
  const handleFiles = (fileList) => {
    const files = Array.from(fileList || []).map((f) => ({ id: nextId(), url: URL.createObjectURL(f), name: f.name }));
    if (files.length) setRecipe((r) => ({ ...r, images: [...r.images, ...files] }));
  };
  const removeImage = (id) => setRecipe((r) => ({ ...r, images: r.images.filter((i) => i.id !== id) }));

  /* ---- Publish ---- */
  const handlePublish = async () => {
    setSaving(true);
    const payload = { ...recipe, createdAt: new Date().toISOString() };
    await createRecipe(payload); // local-only stub for now, swap in recipeService.js when the backend is ready
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3200);
  };

  const filledIngredients = recipe.ingredients.filter((i) => i.name.trim());
  const filledSteps = recipe.instructions.filter((s) => s.description.trim());
  const previewImage = recipe.images[0]?.url || foodPlaceholder;

  return (
    <div style={{ backgroundColor: COLORS.bg, ...bodyFont, color: COLORS.dark }} className="min-h-screen w-full overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        @keyframes float1 { 0%,100% { transform: translateY(0) rotate(-4deg);} 50% { transform: translateY(-12px) rotate(2deg);} }
        @keyframes float2 { 0%,100% { transform: translateY(0) rotate(3deg);} 50% { transform: translateY(-16px) rotate(-3deg);} }
        @keyframes blobMove { 0%,100% { transform: translate(0,0) scale(1);} 50% { transform: translate(16px,-24px) scale(1.06);} }
        @keyframes fadeUp { from { opacity:0; transform: translateY(14px);} to { opacity:1; transform: translateY(0);} }

        .float-a { animation: float1 5s ease-in-out infinite; }
        .float-b { animation: float2 6s ease-in-out infinite; }
        .blob { animation: blobMove 10s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.5s ease both; }

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
          <button className="flex items-center gap-2" onClick={() => navigate("/")}>
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
              <div className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: COLORS.border }}>
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80&auto=format&fit=crop"
                  alt="Admin avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <span style={{ ...displayFont, color: COLORS.dark }} className="hidden md:inline text-sm font-semibold">
                Admin
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 pt-8 pb-24">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm font-semibold mb-6 transition-transform duration-200 hover:-translate-x-0.5"
          style={{ color: COLORS.secondary, ...displayFont }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* ---------------- Hero ---------------- */}
        <section className="relative rounded-[32px] overflow-hidden mb-10 fade-up" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <div
            className="blob absolute rounded-full opacity-60 pointer-events-none"
            style={{ width: 220, height: 220, backgroundColor: COLORS.cream, filter: "blur(46px)", top: "-60px", left: "-40px" }}
          />
          <div
            className="blob absolute rounded-full opacity-50 pointer-events-none"
            style={{ width: 180, height: 180, backgroundColor: COLORS.sage, filter: "blur(46px)", bottom: "-50px", right: "18%", animationDelay: "3s" }}
          />
          <div className="relative z-10 grid md:grid-cols-[1.3fr,1fr] gap-8 items-center px-7 md:px-12 py-10 md:py-14">
            <div>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full mb-5"
                style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
              >
                <Heart size={13} weight="fill" /> Share your culinary creation
              </span>
              <h1 style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                Add Your <span style={{ color: COLORS.primary }}>Recipe</span>
              </h1>
              <p style={{ color: COLORS.secondary }} className="text-base leading-relaxed max-w-md">
                Share your favorite dish with our community and inspire home cooks around the world.
              </p>
            </div>

            <div className="relative hidden md:flex items-center justify-center h-56">
              <div className="w-48 h-48 rounded-3xl overflow-hidden shadow-xl border-8" style={{ borderColor: COLORS.bg }}>
                <img
                  src="https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=600&q=80&auto=format&fit=crop"
                  alt="Kitchen essentials"
                  className="w-full h-full object-cover"
                />
              </div>
              {FLOATING_TAGS.map((tag, i) => (
                <div
                  key={tag.label}
                  className={`absolute flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold ${i % 2 === 0 ? "float-a" : "float-b"}`}
                  style={{ top: tag.top, left: tag.left, backgroundColor: COLORS.card, animationDelay: tag.delay, ...displayFont, color: COLORS.dark }}
                >
                  <span>{tag.emoji}</span> {tag.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------- Form + Preview grid ---------------- */}
        <div className="grid lg:grid-cols-[1.7fr,1fr] gap-8 items-start">
          <div className="flex flex-col gap-6">
            {/* ---- Recipe Details ---- */}
            <SectionCard number={1} title="Recipe Details">
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Field label="Recipe Name" required>
                  <input
                    value={recipe.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="e.g. Creamy Garlic Pasta"
                    className={inputClass}
                    style={{ borderColor: COLORS.border }}
                  />
                </Field>
                <Field label="Cuisine">
                  <SelectField
                    value={recipe.cuisine}
                    onChange={(e) => update("cuisine", e.target.value)}
                    options={CUISINES}
                    placeholder="e.g. Italian"
                  />
                </Field>
              </div>
              <div className="grid sm:grid-cols-3 gap-5 mb-5">
                <Field label="Category" required>
                  <SelectField
                    value={recipe.category}
                    onChange={(e) => update("category", e.target.value)}
                    options={CATEGORIES}
                    placeholder="Select category"
                  />
                </Field>
                <Field label="Cooking Time" required>
                  <input
                    value={recipe.cookingTime}
                    onChange={(e) => update("cookingTime", e.target.value)}
                    placeholder="e.g. 30 min"
                    className={inputClass}
                    style={{ borderColor: COLORS.border }}
                  />
                </Field>
                <Field label="Difficulty" required>
                  <SelectField
                    value={recipe.difficulty}
                    onChange={(e) => update("difficulty", e.target.value)}
                    options={DIFFICULTIES}
                    placeholder="Select difficulty"
                  />
                </Field>
              </div>
              <Field label="Short Description" required>
                <div className="relative">
                  <textarea
                    value={recipe.description}
                    onChange={(e) => update("description", e.target.value.slice(0, 200))}
                    rows={3}
                    placeholder="Write a short description about your recipe..."
                    className={`${inputClass} resize-none`}
                    style={{ borderColor: COLORS.border }}
                  />
                  <span className="absolute bottom-2.5 right-4 text-[11px]" style={{ color: COLORS.secondary }}>
                    {recipe.description.length}/200
                  </span>
                </div>
              </Field>
            </SectionCard>

            {/* ---- Ingredients ---- */}
            <SectionCard
              number={2}
              title="Ingredients"
              action={<GhostButton onClick={addIngredient}><Plus size={13} weight="bold" /> Add Ingredient</GhostButton>}
              tip="Tip: Be specific about quantities for the best results!"
            >
              <div className="hidden sm:grid grid-cols-[1fr,110px,110px,44px] gap-3 mb-2 px-1">
                <span className="text-xs font-semibold" style={{ color: COLORS.secondary }}>Ingredient</span>
                <span className="text-xs font-semibold" style={{ color: COLORS.secondary }}>Quantity</span>
                <span className="text-xs font-semibold" style={{ color: COLORS.secondary }}>Unit</span>
                <span className="text-xs font-semibold text-center" style={{ color: COLORS.secondary }}>Actions</span>
              </div>
              <div className="flex flex-col gap-3">
                {recipe.ingredients.map((ing) => (
                  <div key={ing.id} className="grid grid-cols-1 sm:grid-cols-[1fr,110px,110px,44px] gap-3 items-center">
                    <input
                      value={ing.name}
                      onChange={(e) => updateIngredient(ing.id, "name", e.target.value)}
                      placeholder="e.g. Tomato"
                      className={inputClass}
                      style={{ borderColor: COLORS.border }}
                    />
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(ing.id, "quantity", e.target.value)}
                      placeholder="2"
                      className={inputClass}
                      style={{ borderColor: COLORS.border }}
                    />
                    <SelectField
                      value={ing.unit}
                      onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)}
                      options={UNITS}
                      placeholder="Unit"
                    />
                    <IconButton onClick={() => removeIngredient(ing.id)} tint={COLORS.rose} label="Remove ingredient">
                      <Trash size={16} color={COLORS.roseText} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ---- Instructions ---- */}
            <SectionCard
              number={3}
              title="Instructions"
              action={<GhostButton onClick={addStep}><Plus size={13} weight="bold" /> Add Step</GhostButton>}
              tip="Tip: Clear steps with images help others cook your recipe perfectly."
            >
              <div className="flex flex-col gap-4">
                {recipe.instructions.map((step, idx) => (
                  <div key={step.id} className="flex gap-3 items-start">
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-1"
                      style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
                    >
                      {idx + 1}
                    </span>
                    <textarea
                      value={step.description}
                      onChange={(e) => updateStep(step.id, "description", e.target.value)}
                      rows={2}
                      placeholder={`Describe step ${idx + 1}...`}
                      className={`${inputClass} resize-none flex-1`}
                      style={{ borderColor: COLORS.border }}
                    />
                    <label
                      className="w-16 h-16 rounded-xl border-2 border-dashed flex items-center justify-center shrink-0 cursor-pointer overflow-hidden transition-colors duration-200"
                      style={{ borderColor: COLORS.border, backgroundColor: COLORS.bg }}
                    >
                      {step.image ? (
                        <img src={step.image} alt={`Step ${idx + 1}`} className="w-full h-full object-cover" />
                      ) : (
                        <ImageSquare size={20} color={COLORS.secondary} />
                      )}
                      <input type="file" accept="image/*" hidden onChange={(e) => setStepImage(step.id, e.target.files?.[0])} />
                    </label>
                    <IconButton onClick={() => removeStep(step.id)} tint={COLORS.rose} label="Remove step">
                      <X size={15} color={COLORS.roseText} />
                    </IconButton>
                  </div>
                ))}
              </div>
            </SectionCard>

            {/* ---- Upload Photos ---- */}
            <SectionCard number={4} title="Upload Photos">
              <div className="grid md:grid-cols-[1.4fr,1fr] gap-6">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                  }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragActive(false);
                    handleFiles(e.dataTransfer.files);
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center py-10 px-6 transition-colors duration-200 cursor-pointer"
                  style={{ borderColor: dragActive ? COLORS.primary : COLORS.border, backgroundColor: dragActive ? COLORS.cream : COLORS.bg }}
                >
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3" style={{ backgroundColor: COLORS.cream }}>
                    <UploadCloud size={22} color={COLORS.primaryDark} />
                  </div>
                  <p style={{ ...displayFont, color: COLORS.dark }} className="text-sm font-semibold mb-1">
                    Drag & drop your images here
                  </p>
                  <p style={{ color: COLORS.secondary }} className="text-xs mb-4">
                    or
                  </p>
                  <span
                    className="px-5 py-2 rounded-full text-white text-xs font-semibold shadow-sm"
                    style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
                  >
                    Browse Files
                  </span>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple hidden onChange={(e) => handleFiles(e.target.files)} />
                  <p className="text-[11px] mt-4" style={{ color: COLORS.secondary }}>
                    Supported formats: JPG, PNG, WEBP (Max 5MB each)
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold mb-3" style={{ ...displayFont, color: COLORS.dark }}>
                    Tips for great photos
                  </p>
                  <ul className="flex flex-col gap-2.5">
                    {["Use natural lighting", "Show your dish clearly", "Add process photos", "High resolution works best"].map((tip) => (
                      <li key={tip} className="flex items-center gap-2 text-xs" style={{ color: COLORS.secondary }}>
                        <Leaf size={13} weight="fill" color={COLORS.sageText} /> {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {recipe.images.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-6">
                  {recipe.images.map((img) => (
                    <div key={img.id} className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ border: `1px solid ${COLORS.border}` }}>
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(img.id)}
                        aria-label="Remove image"
                        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "rgba(45,45,45,0.6)" }}
                      >
                        <X size={11} color="#fff" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          {/* ---------------- Recipe Preview ---------------- */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-3xl shadow-sm overflow-hidden" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center gap-2 px-6 pt-6 pb-4">
                <Eye size={16} color={COLORS.primaryDark} />
                <h4 style={{ ...displayFont, color: COLORS.dark }} className="text-sm font-bold">
                  Recipe Preview
                </h4>
              </div>

              <div className="relative mx-6 rounded-2xl overflow-hidden aspect-[4/3]" style={{ backgroundColor: COLORS.bg }}>
                <img src={previewImage} alt="Recipe preview" className="w-full h-full object-cover" />
                <span
                  className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
                >
                  <Bookmark size={15} color={COLORS.primaryDark} />
                </span>
              </div>

              <div className="px-6 pt-5 pb-6">
                <h3 style={{ ...displayFont, color: COLORS.dark }} className="text-lg font-bold mb-2 break-words">
                  {recipe.title || "Your Recipe Name"}
                </h3>

                <div className="flex flex-wrap gap-2 mb-4">
                  {recipe.cuisine && <Pill bg={COLORS.sage} color={COLORS.sageText}>{recipe.cuisine}</Pill>}
                  {recipe.category && <Pill bg={COLORS.clay} color={COLORS.clayText}>{recipe.category}</Pill>}
                  {recipe.difficulty && <Pill bg={COLORS.cream} color={COLORS.primaryDark}>{recipe.difficulty}</Pill>}
                </div>

                {recipe.cookingTime && (
                  <div className="flex items-center gap-1.5 text-xs mb-4" style={{ color: COLORS.secondary }}>
                    <Clock size={14} /> {recipe.cookingTime}
                  </div>
                )}

                <p className="text-xs leading-relaxed mb-5" style={{ color: COLORS.secondary }}>
                  {recipe.description || "Your recipe description will appear here as you type."}
                </p>

                {filledIngredients.length > 0 && (
                  <div className="mb-5">
                    <h5 style={{ ...displayFont, color: COLORS.dark }} className="text-xs font-bold mb-2">
                      Ingredients ({filledIngredients.length})
                    </h5>
                    <ul className="flex flex-col gap-1">
                      {filledIngredients.map((i) => (
                        <li key={i.id} className="text-xs" style={{ color: COLORS.secondary }}>
                          • {i.quantity} {i.unit} {i.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {filledSteps.length > 0 && (
                  <div className="mb-5">
                    <h5 style={{ ...displayFont, color: COLORS.dark }} className="text-xs font-bold mb-2">
                      Steps ({filledSteps.length})
                    </h5>
                    <ol className="flex flex-col gap-1 list-decimal list-inside">
                      {filledSteps.map((s) => (
                        <li key={s.id} className="text-xs" style={{ color: COLORS.secondary }}>
                          {s.description}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                <div className="rounded-2xl px-4 py-3 flex items-start gap-2" style={{ backgroundColor: COLORS.cream }}>
                  <Sparkle size={15} color={COLORS.primaryDark} className="mt-0.5 shrink-0" />
                  <p className="text-[11px] leading-relaxed" style={{ color: COLORS.primaryDark }}>
                    This is how your recipe will look to others.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* ---------------- Publish ---------------- */}
        <section
          className="rounded-3xl p-6 md:p-8 mt-8 flex flex-col md:flex-row items-center justify-between gap-5"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <div className="flex items-center gap-4 text-center md:text-left">
            <div
              className="w-14 h-14 rounded-2xl items-center justify-center shrink-0 hidden sm:flex"
              style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})` }}
            >
              <ChefHat size={24} color="#fff" />
            </div>
            <div>
              <h4 style={{ ...displayFont, color: COLORS.dark }} className="font-bold text-base mb-1">
                Ready to share your recipe?
              </h4>
              <p className="text-sm" style={{ color: COLORS.secondary }}>
                Once you publish, our team will review your recipe before it goes live.
              </p>
            </div>
          </div>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 shrink-0"
            style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
          >
            <Send size={16} weight="bold" /> {saving ? "Publishing..." : "Publish Recipe"}
          </button>
        </section>
      </div>

      {/* ---------------- Success toast ---------------- */}
      {saved && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3.5 rounded-2xl shadow-lg fade-up"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        >
          <CheckCircle size={18} color={COLORS.sageText} weight="fill" />
          <span className="text-sm font-semibold" style={{ ...displayFont, color: COLORS.dark }}>
            Recipe saved! Ready to connect to a backend.
          </span>
        </div>
      )}
    </div>
  );
}