import { useEffect, useMemo, useState } from "react";
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
} from "phosphor-react";
import AdminHeader from "../AdminHeader";
import EmptyState from "../EmptyState";
import ConfirmDialog from "../ConfirmDialog";
import Pagination from "../Pagination";
import { getRecipes, deleteRecipe } from "../../services/recipeService";
import { RECIPE_CATEGORIES } from "../../utils/constants";
import { COLORS, displayFont, bodyFont } from "../../utils/theme";
import { formatDate } from "../../utils/id";
import foodPlaceholder from "../../Images/food.png";

const PAGE_SIZE = 8;

export default function RecipeList() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadRecipes() {
    setLoading(true);
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      toast.error(err.message || "Could not load recipes.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecipes();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return recipes.filter((r) => {
      const matchesSearch = !term || r.title?.toLowerCase().includes(term);
      const matchesCategory = category === "All" || r.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [recipes, search, category]);

  useEffect(() => {
    setPage(1);
  }, [search, category]);

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

      <AdminHeader active="Recipes" />

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 pt-8 pb-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 style={{ ...displayFont, color: COLORS.dark }} className="text-2xl md:text-3xl font-bold">
              Recipes
            </h1>
            <p style={{ color: COLORS.secondary }} className="text-sm mt-1">
              {recipes.length} recipe{recipes.length === 1 ? "" : "s"} in your library
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/add-recipe")}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 shrink-0"
            style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
          >
            <Plus size={16} weight="bold" /> Add Recipe
          </button>
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
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : !hasAnyRecipes ? (
          <EmptyState
            Icon={BookOpen}
            title="No recipes yet"
            subtitle="Your recipe library is empty. Add your first recipe to see it appear here."
            action={
              <button
                onClick={() => navigate("/admin/add-recipe")}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105"
                style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
              >
                <Plus size={16} weight="bold" /> Add Your First Recipe
              </button>
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
            {/* Desktop table */}
            <div className="hidden md:block rounded-3xl overflow-hidden shadow-sm" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: COLORS.cream }}>
                    <th className="text-left px-6 py-4 font-semibold" style={{ ...displayFont, color: COLORS.dark }}>Recipe</th>
                    <th className="text-left px-6 py-4 font-semibold" style={{ ...displayFont, color: COLORS.dark }}>Category</th>
                    <th className="text-left px-6 py-4 font-semibold" style={{ ...displayFont, color: COLORS.dark }}>Difficulty</th>
                    <th className="text-left px-6 py-4 font-semibold" style={{ ...displayFont, color: COLORS.dark }}>Time</th>
                    <th className="text-left px-6 py-4 font-semibold" style={{ ...displayFont, color: COLORS.dark }}>Added</th>
                    <th className="text-right px-6 py-4 font-semibold" style={{ ...displayFont, color: COLORS.dark }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((r) => (
                    <tr key={r.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={r.images?.[0]?.url || foodPlaceholder}
                            alt={r.title}
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                          <span className="font-semibold" style={{ ...displayFont, color: COLORS.dark }}>
                            {r.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}>
                          {r.category || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4" style={{ color: COLORS.secondary }}>{r.difficulty || "—"}</td>
                      <td className="px-6 py-4" style={{ color: COLORS.secondary }}>
                        <span className="flex items-center gap-1.5">
                          <Clock size={14} /> {r.cookingTime || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4" style={{ color: COLORS.secondary }}>{formatDate(r.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <RowIconButton label="Edit" onClick={() => navigate(`/admin/edit-recipe/${r.id}`)}>
                            <Edit size={16} color={COLORS.primaryDark} />
                          </RowIconButton>
                          <RowIconButton label="Delete" onClick={() => setConfirmTarget(r)} danger>
                            <Trash size={16} color={COLORS.roseText} />
                          </RowIconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-4">
              {pageItems.map((r) => (
                <div key={r.id} className="rounded-3xl p-4 shadow-sm flex gap-4" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                  <img src={r.images?.[0]?.url || foodPlaceholder} alt={r.title} className="w-20 h-20 rounded-2xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1 truncate" style={{ ...displayFont, color: COLORS.dark }}>{r.title}</h4>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {r.category && (
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}>
                          {r.category}
                        </span>
                      )}
                      {r.difficulty && (
                        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: COLORS.sage, color: COLORS.sageText, ...displayFont }}>
                          {r.difficulty}
                        </span>
                      )}
                    </div>
                    <p className="text-xs mb-3 flex items-center gap-1.5" style={{ color: COLORS.secondary }}>
                      <Clock size={13} /> {r.cookingTime || "—"} • Added {formatDate(r.createdAt)}
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit-recipe/${r.id}`)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
                      >
                        <Edit size={13} /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmTarget(r)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: COLORS.rose, color: COLORS.roseText, ...displayFont }}
                      >
                        <Trash size={13} /> Delete
                      </button>
                    </div>
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
