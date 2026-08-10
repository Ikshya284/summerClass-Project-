import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ArrowLeft,
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
} from "phosphor-react";
import AdminHeader from "../AdminHeader";
import foodPlaceholder from "../../Images/food.png";
import { createRecipe, updateRecipe, getRecipeById } from "../../services/recipeService";
import { getIngredients, createIngredient } from "../../services/ingredientService";
import { COLORS, displayFont, bodyFont } from "../../utils/theme";
import { RECIPE_CUISINES, RECIPE_CATEGORIES, RECIPE_DIFFICULTIES, RECIPE_UNITS } from "../../utils/constants";
import { validateRequired } from "../../utils/validators";

const inputClass =
  "w-full rounded-2xl px-4 py-3 text-sm bg-white outline-none transition-all duration-200 border focus:ring-2 focus:ring-[#F38D39]/25 focus:border-[#F38D39]";

/* ---------------------------------- Static option lists (shared with the rest of the site) ---------------------------------- */
const CUISINES = RECIPE_CUISINES;
const CATEGORIES = RECIPE_CATEGORIES;
const DIFFICULTIES = RECIPE_DIFFICULTIES;
const UNITS = RECIPE_UNITS;



let idSeed = 0;
const nextId = () => `id-${Date.now()}-${idSeed++}`;

const emptyIngredient = () => ({ id: nextId(), ingredientId: "", name: "", unit: "", quantity: "" });
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
  isPublished: true,
  createdBy: "Chef ",
  createdAt: null,
});

/* ---------------------------------- Small shared UI pieces ---------------------------------- */
function Field({ label, required, className = "", error, children }) {
  return (
    <div className={className}>
      <label style={{ ...displayFont, color: COLORS.dark }} className="block text-sm font-semibold mb-2">
        {label} {required && <span style={{ color: COLORS.roseText }}>*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs mt-1.5" style={{ color: COLORS.roseText }}>
          {error}
        </p>
      )}
    </div>
  );
}

function SelectField({ value, onChange, options, placeholder, error }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className={`${inputClass} appearance-none pr-10 cursor-pointer`}
        style={{ borderColor: error ? COLORS.roseText : COLORS.border, ...bodyFont, color: value ? COLORS.dark : COLORS.secondary }}
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
  const { id } = useParams();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);

  const [recipe, setRecipe] = useState(buildInitialRecipe());
  const [availableIngredients, setAvailableIngredients] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getIngredients()
      .then(setAvailableIngredients)
      .catch((err) => toast.error(err.message || "Could not load ingredients."));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    let cancelled = false;
    setLoading(true);
    getRecipeById(id)
      .then((existing) => {
        if (cancelled) return;
        if (!existing) {
          toast.error("Recipe not found. It may have already been deleted.");
          navigate("/admin/recipes");
          return;
        }
        setRecipe({
          ...buildInitialRecipe(),
          ...existing,
          ingredients: existing.ingredients?.length
            ? existing.ingredients.map((ing) => ({
                id: nextId(),
                ingredientId: String(ing.ingredientId || ing.id || ""),
                name: ing.name || "",
                unit: ing.unit || "",
                quantity: String(ing.quantity ?? ""),
              }))
            : [emptyIngredient()],
          instructions: existing.instructions?.length ? existing.instructions : [emptyStep()],
          images: existing.images || [],
        });
        setImageFile(null);
        setImagePreviewUrl(existing.imageUrl || existing.images?.[0]?.url || null);
      })
      .catch((err) => toast.error(err.message || "Could not load this recipe."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  const update = (field, value) => {
    setRecipe((r) => ({ ...r, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  /* ---- Ingredients ---- */
  const addIngredient = () => setRecipe((r) => ({ ...r, ingredients: [...r.ingredients, emptyIngredient()] }));
  const removeIngredient = (id) =>
    setRecipe((r) => ({
      ...r,
      ingredients: r.ingredients.length > 1 ? r.ingredients.filter((i) => i.id !== id) : r.ingredients,
    }));
  const updateIngredient = (id, field, value) =>
    setRecipe((r) => ({ ...r, ingredients: r.ingredients.map((i) => (i.id === id ? { ...i, [field]: value } : i)) }));

  // Typing a name checks it against the saved ingredient list; a match auto-fills
  // the unit and links to that ingredient, otherwise it's treated as a brand-new one.
  const updateIngredientName = (id, value) => {
    const match = availableIngredients.find((a) => a.name.toLowerCase() === value.trim().toLowerCase());
    setRecipe((r) => ({
      ...r,
      ingredients: r.ingredients.map((i) =>
        i.id === id
          ? { ...i, name: value, ingredientId: match ? String(match.id) : "", unit: match ? match.unit : i.unit }
          : i
      ),
    }));
  };

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

  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  /* ---- Recipe photos ---- */
  const handleFiles = (fileList) => {
    const file = Array.from(fileList || [])[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be 5MB or smaller.");
      return;
    }

    if (imagePreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
    setRecipe((r) => ({ ...r, images: [] }));
  };
  const removeImage = () => {
    if (imagePreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setImageFile(null);
    setImagePreviewUrl(null);
    setRecipe((r) => ({ ...r, images: [] }));
  };

  /* ---- Validation ---- */
  function validate() {
    const nextErrors = {
      title: validateRequired(recipe.title, "Recipe name"),
      category: validateRequired(recipe.category, "Category"),
      cookingTime: validateRequired(recipe.cookingTime, "Cooking time"),
      difficulty: validateRequired(recipe.difficulty, "Difficulty"),
      description: validateRequired(recipe.description, "Description"),
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  }

  /* ---- Publish ---- */
  const handlePublish = async () => {
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!isEdit && !imageFile) {
      toast.error("Please upload a recipe image.");
      return;
    }
    setSaving(true);
    try {
      // Any ingredient typed in that doesn't match an existing one gets created
      // on the fly so it can be reused (and matched) next time.
      const newlyCreated = [];
      const nameToId = new Map();
      const resolvedIngredients = [];
      for (const ing of filledIngredients) {
        let ingredientId = ing.ingredientId;
        if (!ingredientId) {
          const key = ing.name.trim().toLowerCase();
          if (nameToId.has(key)) {
            ingredientId = nameToId.get(key);
          } else {
            const created = await createIngredient({
              name: ing.name.trim(),
              unit: ing.unit || UNITS[0],
            });
            ingredientId = created.id;
            nameToId.set(key, ingredientId);
            newlyCreated.push(created);
          }
        }
        resolvedIngredients.push({ ingredientId: Number(ingredientId), quantity: Number(ing.quantity) });
      }
      if (newlyCreated.length) {
        setAvailableIngredients((prev) => [...prev, ...newlyCreated]);
      }

      const payload = {
        ...recipe,
        isPublished: true,
        ingredients: resolvedIngredients,
        instructions: filledSteps,
      };
      if (isEdit) {
        await updateRecipe(id, payload, imageFile);
        toast.success(`"${recipe.title}" updated.`);
      } else {
        await createRecipe(payload, imageFile);
        toast.success(`"${recipe.title}" published.`);
      }
      navigate("/admin/recipes");
    } catch (err) {
      toast.error(err.message || "Could not save this recipe.");
    } finally {
      setSaving(false);
    }
  };

  const filledIngredients = recipe.ingredients.filter((i) => i.name.trim() && String(i.quantity).trim());
  const filledSteps = recipe.instructions.filter((s) => s.description.trim());
  const previewImage = imagePreviewUrl || recipe.images[0]?.url || foodPlaceholder;

  return (
    <div style={{ backgroundColor: COLORS.bg, ...bodyFont, color: COLORS.dark }} className="min-h-screen w-full overflow-x-hidden">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>


      {/* ---------------- Top Navbar ---------------- */}
      <AdminHeader active="Recipes" />

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 pt-8 pb-24">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold mb-6 transition-transform duration-200 hover:-translate-x-0.5"
          style={{ color: COLORS.secondary, ...displayFont }}
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        {/* ---------------- Hero ---------------- */}
        <section className="relative rounded-[32px] overflow-hidden mb-10 fade-up" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>

          <div className="relative z-10 grid md:grid-cols-[1.3fr,1fr] gap-8 items-center px-7 md:px-12 py-10 md:py-14">
            <div>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-1.5 rounded-full mb-5"
                style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
              >
                <Heart size={13} weight="fill" /> Share your culinary creation
              </span>
              <h1 style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-5xl font-bold leading-tight mb-4">
                {isEdit ? "Edit Your" : "Add Your"} <span style={{ color: COLORS.primary }}>Recipe</span>
              </h1>
              <p style={{ color: COLORS.secondary }} className="text-base leading-relaxed max-w-md">
                {isEdit
                  ? "Update the details below to keep this recipe accurate and fresh."
                  : "Share your favorite dish with our community and inspire home cooks around the world."}
              </p>
            </div>


          </div>
        </section>

        {/* ---------------- Form + Preview grid ---------------- */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-40 rounded-3xl animate-pulse"
                style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
              />
            ))}
          </div>
        ) : (
        <div className="grid lg:grid-cols-[1.7fr,1fr] gap-8 items-start">
          <div className="flex flex-col gap-6">
            {/* ---- Recipe Details ---- */}
            <SectionCard number={1} title="Recipe Details">
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <Field label="Recipe Name" required error={errors.title}>
                  <input
                    value={recipe.title}
                    onChange={(e) => update("title", e.target.value)}
                    placeholder="e.g. Creamy Garlic Pasta"
                    className={inputClass}
                    style={{ borderColor: errors.title ? COLORS.roseText : COLORS.border }}
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
                <Field label="Category" required error={errors.category}>
                  <SelectField
                    value={recipe.category}
                    onChange={(e) => update("category", e.target.value)}
                    options={CATEGORIES}
                    placeholder="Select category"
                    error={errors.category}
                  />
                </Field>
                <Field label="Cooking Time" required error={errors.cookingTime}>
                  <input
                    value={recipe.cookingTime}
                    onChange={(e) => update("cookingTime", e.target.value)}
                    placeholder="e.g. 30 min"
                    className={inputClass}
                    style={{ borderColor: errors.cookingTime ? COLORS.roseText : COLORS.border }}
                  />
                </Field>
                <Field label="Difficulty" required error={errors.difficulty}>
                  <SelectField
                    value={recipe.difficulty}
                    onChange={(e) => update("difficulty", e.target.value)}
                    options={DIFFICULTIES}
                    placeholder="Select difficulty"
                    error={errors.difficulty}
                  />
                </Field>
              </div>
              <Field label="Short Description" required error={errors.description}>
                <div className="relative">
                  <textarea
                    value={recipe.description}
                    onChange={(e) => update("description", e.target.value.slice(0, 200))}
                    rows={3}
                    placeholder="Write a short description about your recipe..."
                    className={`${inputClass} resize-none`}
                    style={{ borderColor: errors.description ? COLORS.roseText : COLORS.border }}
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
              tip="Tip: Type any ingredient name — pick a suggestion or add a brand-new one."
            >
              <datalist id="ingredient-options">
                {availableIngredients.map((opt) => (
                  <option key={opt.id} value={opt.name} />
                ))}
              </datalist>
              <div className="hidden sm:grid grid-cols-[1fr,110px,100px,44px] gap-3 mb-2 px-1">
                <span className="text-xs font-semibold" style={{ color: COLORS.secondary }}>Ingredient</span>
                <span className="text-xs font-semibold" style={{ color: COLORS.secondary }}>Unit</span>
                <span className="text-xs font-semibold" style={{ color: COLORS.secondary }}>Quantity</span>
                <span className="text-xs font-semibold text-center" style={{ color: COLORS.secondary }}>Actions</span>
              </div>
              <div className="flex flex-col gap-3">
                {recipe.ingredients.map((ing) => {
                  const isExisting = Boolean(ing.ingredientId);
                  return (
                  <div key={ing.id} className="grid grid-cols-1 sm:grid-cols-[1fr,110px,100px,44px] gap-3 items-center">
                    <div>
                      <input
                        type="text"
                        list="ingredient-options"
                        value={ing.name}
                        onChange={(e) => updateIngredientName(ing.id, e.target.value)}
                        placeholder="Type an ingredient name..."
                        className={inputClass}
                        style={{ borderColor: COLORS.border }}
                      />
                      {ing.name.trim() && !isExisting && (
                        <p className="text-[11px] mt-1 px-1" style={{ color: COLORS.sageText }}>
                          New ingredient — will be added
                        </p>
                      )}
                    </div>
                    <select
                      value={ing.unit}
                      disabled={isExisting}
                      onChange={(e) => updateIngredient(ing.id, "unit", e.target.value)}
                      className={`${inputClass} appearance-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-70`}
                      style={{ borderColor: COLORS.border }}
                    >
                      <option value="" disabled>Unit</option>
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min="0"
                      step="0.5"
                      value={ing.quantity}
                      onChange={(e) => updateIngredient(ing.id, "quantity", e.target.value)}
                      placeholder="Qty"
                      className={inputClass}
                      style={{ borderColor: COLORS.border }}
                    />
                    <IconButton onClick={() => removeIngredient(ing.id)} tint={COLORS.rose} label="Remove ingredient">
                      <Trash size={16} color={COLORS.roseText} />
                    </IconButton>
                  </div>
                  );
                })}
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
                  <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={(e) => handleFiles(e.target.files)} />
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

              {imagePreviewUrl && (
                <div className="flex items-center gap-4 mt-6">
                  <div
                    className="relative w-28 h-28 rounded-2xl overflow-hidden shrink-0"
                    style={{ border: `1px solid ${COLORS.border}` }}
                  >
                    <img src={imagePreviewUrl} alt="Recipe preview" className="w-full h-full object-cover" />
                    <button
                      onClick={removeImage}
                      aria-label="Remove image"
                      className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: "rgba(45,45,45,0.6)" }}
                    >
                      <X size={11} color="#fff" />
                    </button>
                  </div>
                  <div className="text-xs" style={{ color: COLORS.secondary }}>
                    <p style={{ ...displayFont, color: COLORS.dark }} className="font-semibold mb-1">
                      {imageFile ? imageFile.name : "Current recipe photo"}
                    </p>
                    {imageFile && <p>{(imageFile.size / (1024 * 1024)).toFixed(2)} MB</p>}
                  </div>
                </div>
              )}
            </SectionCard>
          </div>


        </div>
        )}

        {/* ---------------- Publish ---------------- */}
        {!loading && (
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
                {isEdit ? "Ready to save your changes?" : "Ready to share your recipe?"}
              </h4>
            </div>
          </div>
          <button
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3.5 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100 shrink-0"
            style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
          >
            <Send size={16} weight="bold" />
            {saving ? (isEdit ? "Saving..." : "Publishing...") : isEdit ? "Save Changes" : "Publish Recipe"}
          </button>
        </section>
        )}
      </div>

    </div>
  );
}