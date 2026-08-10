import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  MagnifyingGlass as Search,
  Plus,
  PencilSimple as Edit,
  TrashSimple as Trash,
  Clock,
  BookOpen,
  CaretDown,
  ArrowLeft,
} from "phosphor-react";
import { useAuth } from "../../context/AuthContext";
import AdminHeader from "../AdminHeader";
import Navbar from "../Navbar";
import EmptyState from "../EmptyState";
import ConfirmDialog from "../ConfirmDialog";
import Pagination from "../Pagination";
import { getRecipes, deleteRecipe } from "../../services/recipeService";
import { RECIPE_CATEGORIES, RECIPE_DIFFICULTIES } from "../../utils/constants";
import { COLORS, displayFont, bodyFont } from "../../utils/theme";
import foodPlaceholder from "../../Images/food.png";

const PAGE_SIZE = 8;

export default function RecipeList() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadRecipes() {
    setLoading(true);
    try {
      const data = await getRecipes({ search, difficulty, category });
      setRecipes(data);
    } catch (err) {
      toast.error(err.message || "Could not load recipes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, [search, difficulty, category]);

  const filtered = recipes;

  useEffect(() => {
    setPage(1);
  }, [search, category, difficulty]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteRecipe(confirmTarget.id);
      toast.success(`"${confirmTarget.title}" deleted.`);
      setConfirmTarget(null);
      await loadRecipes();
    } catch (err) {
      toast.error(err.message || "Could not delete recipe.");
    } finally {
      setDeleting(false);
    }
  }

  const hasAnyRecipes = recipes.length > 0;
  const hasResults = filtered.length > 0;

  return (
    <div style={{ backgroundColor: COLORS.bg, ...bodyFont, color: COLORS.dark }} className="min-h-screen w-full">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

      {isAdmin ? <AdminHeader active="Recipes" /> : <Navbar />}

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 pt-8 pb-24">
        {!isAdmin && (
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-sm font-semibold mb-6 transition-transform duration-200 hover:-translate-x-0.5"
            style={{ color: COLORS.secondary, ...displayFont }}
          >
            <ArrowLeft size={16} /> Back to Home
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 style={{ ...displayFont, color: COLORS.dark }} className="text-2xl md:text-3xl font-bold">
              Recipes
            </h1>
            <p style={{ color: COLORS.secondary }} className="text-sm mt-1">
              {recipes.length} recipe{recipes.length === 1 ? "" : "s"} in your library
            </p>
          </div>
          {isAdmin && (
            <button
              onClick={() => navigate("/admin/add-recipe")}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 shrink-0"
              style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
            >
              <Plus size={16} weight="bold" /> Add Recipe
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" color={COLORS.secondary} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes by name..."
              className="w-full h-12 rounded-2xl border pl-11 pr-4 text-sm outline-none focus:border-[#F38D39] transition-colors duration-200"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}
              aria-label="Search recipes"
            />
          </div>
          <div className="relative sm:w-56">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-12 rounded-2xl border pl-4 pr-10 text-sm outline-none appearance-none cursor-pointer focus:border-[#F38D39] transition-colors duration-200"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.card, color: COLORS.dark }}
              aria-label="Filter by category"
            >
              <option value="All">All Categories</option>
              {RECIPE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <CaretDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" color={COLORS.secondary} />
          </div>
          <div className="relative sm:w-48">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full h-12 rounded-2xl border pl-4 pr-10 text-sm outline-none appearance-none cursor-pointer focus:border-[#F38D39] transition-colors duration-200"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.card, color: COLORS.dark }}
              aria-label="Filter by difficulty"
            >
              <option value="All">All Difficulty</option>
              {RECIPE_DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <CaretDown size={13} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" color={COLORS.secondary} />
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : !hasAnyRecipes ? (
          <EmptyState
            Icon={BookOpen}
            title="No recipes yet"
            subtitle={
              isAdmin
                ? "Your recipe library is empty. Add your first recipe to see it appear here."
                : "There aren't any recipes to browse yet. Check back soon!"
            }
            action={
              isAdmin && (
                <button
                  onClick={() => navigate("/admin/add-recipe")}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105"
                  style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
                >
                  <Plus size={16} weight="bold" /> Add Your First Recipe
                </button>
              )
            }
          />
        ) : !hasResults ? (
          <EmptyState
            Icon={Search}
            title="No matching recipes"
            subtitle="Try a different search term or category filter."
            action={
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                  setDifficulty("All");
                }}
                className="px-6 py-2.5 rounded-full text-sm font-semibold border transition-colors duration-200"
                style={{ borderColor: COLORS.border, color: COLORS.dark, ...displayFont }}
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
              {pageItems.map((r) => (
                <div
                  key={r.id}
                  className="rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 flex flex-col"
                  style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={r.images?.[0]?.url || foodPlaceholder}
                      alt={r.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {r.category && (
                      <span
                        className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full shadow-sm"
                        style={{ backgroundColor: "rgba(255,255,255,0.92)", color: COLORS.primaryDark, ...displayFont }}
                      >
                        {r.category}
                      </span>
                    )}
                    {isAdmin && (
                      <div className="absolute top-3 right-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <RowIconButton label="Edit" onClick={() => navigate(`/admin/edit-recipe/${r.id}`)}>
                          <Edit size={15} color={COLORS.primaryDark} />
                        </RowIconButton>
                        <RowIconButton label="Delete" onClick={() => setConfirmTarget(r)} danger>
                          <Trash size={15} color={COLORS.roseText} />
                        </RowIconButton>
                      </div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 style={{ ...displayFont, color: COLORS.dark }} className="font-semibold text-lg mb-3 truncate">
                      {r.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className="flex items-center gap-1 text-xs" style={{ color: COLORS.secondary }}>
                        <Clock size={14} /> {r.cookingTime || "—"}
                      </span>
                      {r.difficulty && <DifficultyBadge level={r.difficulty} />}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/recipes/${r.id}`);
                      }}
                      className="w-full mt-auto py-2.5 rounded-full text-sm font-semibold text-white transition-transform duration-200 hover:scale-105"
                      style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this recipe?"
        message={confirmTarget ? `"${confirmTarget.title}" will be permanently removed. This can't be undone.` : ""}
        confirmLabel="Delete Recipe"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmTarget(null)}
      />
    </div>
  );
}

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

function RowIconButton({ onClick, label, children, danger }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform duration-200 hover:scale-110"
      style={{ backgroundColor: danger ? COLORS.rose : COLORS.cream }}
    >
      {children}
    </button>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-20 rounded-3xl animate-pulse"
          style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}
        />
      ))}
    </div>
  );
}
