import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Clock,
  Leaf,
} from "phosphor-react";
import { getRecipeById } from "../../services/recipeService";
import { COLORS, displayFont, bodyFont } from "../../utils/theme";
import foodPlaceholder from "../../Images/food.png";
import Navbar from "../Navbar";
import AdminHeader from "../AdminHeader";
import { useAuth, roleHomePath } from "../../context/AuthContext";

export default function RecipePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getRecipeById(id)
      .then((data) => {
        if (!cancelled) setRecipe(data);
      })
      .catch((err) => {
        toast.error(err.message || "Could not load this recipe.");
        navigate(roleHomePath(user?.role));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, navigate, user?.role]);

  const imageSrc = recipe?.images?.[0]?.url || recipe?.imageUrl || foodPlaceholder;

  if (loading) {
    return (
      <div style={{ backgroundColor: COLORS.bg, ...bodyFont }} className="min-h-screen flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: COLORS.primary, borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div style={{ backgroundColor: COLORS.bg, ...bodyFont, color: COLORS.dark }} className="min-h-screen w-full">
      {isAdmin ? <AdminHeader active="Recipes" /> : <Navbar />}

      <div className="max-w-4xl mx-auto px-5 md:px-8 pt-8 pb-24">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold mb-6 transition-transform duration-200 hover:-translate-x-0.5"
          style={{ color: COLORS.secondary, ...displayFont }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="rounded-[32px] overflow-hidden shadow-sm mb-8" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
          <img src={imageSrc} alt={recipe.title} className="w-full h-64 md:h-80 object-cover" />
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.category && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}>
                  {recipe.category}
                </span>
              )}
              {recipe.difficulty && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.sage, color: COLORS.sageText, ...displayFont }}>
                  {recipe.difficulty}
                </span>
              )}
              {recipe.cuisine && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.bg, color: COLORS.dark, border: `1px solid ${COLORS.border}`, ...displayFont }}>
                  {recipe.cuisine}
                </span>
              )}
            </div>
            <h1 style={{ ...displayFont, color: COLORS.dark }} className="text-3xl md:text-4xl font-bold mb-3">
              {recipe.title}
            </h1>
            <p style={{ color: COLORS.secondary }} className="text-base leading-relaxed mb-4">
              {recipe.description}
            </p>
            <span className="flex items-center gap-1.5 text-sm" style={{ color: COLORS.secondary }}>
              <Clock size={16} /> {recipe.cookingTime}
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="rounded-3xl p-6 md:p-7 shadow-sm" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <h2 style={{ ...displayFont, color: COLORS.dark }} className="text-lg font-bold mb-5">
              Ingredients
            </h2>
            <ul className="flex flex-col gap-3">
              {(recipe.ingredients || []).map((ing, i) => (
                <li key={ing.ingredientId || ing.id || i} className="flex items-center justify-between text-sm">
                  <span style={{ color: COLORS.dark }}>{ing.name}</span>
                  <span style={{ color: COLORS.secondary }}>
                    {ing.quantity} {ing.unit}
                  </span>
                </li>
              ))}
            </ul>
            <p className="text-xs mt-5 flex items-center gap-1.5" style={{ color: COLORS.sageText }}>
              <Leaf size={13} weight="fill" /> Quantities are per the original recipe author.
            </p>
          </section>

          <section className="rounded-3xl p-6 md:p-7 shadow-sm" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
            <h2 style={{ ...displayFont, color: COLORS.dark }} className="text-lg font-bold mb-5">
              Instructions
            </h2>
            <ol className="flex flex-col gap-4">
              {(recipe.instructions || []).map((step, idx) => (
                <li key={idx} className="flex gap-3">
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
                  >
                    {idx + 1}
                  </span>
                  <p style={{ color: COLORS.dark }} className="text-sm leading-relaxed pt-1">
                    {step.description}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
