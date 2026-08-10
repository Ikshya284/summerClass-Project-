import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  MagnifyingGlass as Search,
  Plus,
  PencilSimple as Edit,
  TrashSimple as Trash,
  Package,
} from "phosphor-react";
import AdminHeader from "../Components/AdminHeader";
import EmptyState from "../Components/EmptyState";
import ConfirmDialog from "../Components/ConfirmDialog";
import Pagination from "../Components/Pagination";
import IngredientFormModal from "./IngredientFormModal";
import {
  getIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
} from "../services/ingredientService";
import { COLORS, displayFont, bodyFont } from "../utils/theme";
import { formatDate } from "../utils/id";

const PAGE_SIZE = 8;

export default function IngredientList() {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [saving, setSaving] = useState(false);

  const [confirmTarget, setConfirmTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function loadIngredients() {
    setLoading(true);
    try {
      const data = await getIngredients({ search });
      setIngredients(data);
    } catch (err) {
      toast.error(err.message || "Could not load ingredients.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIngredients();
  }, [search]);

  const filtered = ingredients;

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function openAddForm() {
    setEditingIngredient(null);
    setFormOpen(true);
  }

  function openEditForm(ingredient) {
    setEditingIngredient(ingredient);
    setFormOpen(true);
  }

  async function handleFormSubmit(values) {
    setSaving(true);
    try {
      if (editingIngredient) {
        await updateIngredient(editingIngredient.id, values);
        toast.success(`"${values.name}" updated.`);
      } else {
        await createIngredient(values);
        toast.success(`"${values.name}" added.`);
      }
      setFormOpen(false);
      await loadIngredients();
    } catch (err) {
      toast.error(err.message || "Could not save ingredient.");
    } finally {
      setSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!confirmTarget) return;
    setDeleting(true);
    try {
      await deleteIngredient(confirmTarget.id);
      toast.success(`"${confirmTarget.name}" deleted.`);
      setConfirmTarget(null);
      await loadIngredients();
    } catch (err) {
      toast.error(err.message || "Could not delete ingredient.");
    } finally {
      setDeleting(false);
    }
  }

  const hasAny = ingredients.length > 0;
  const hasResults = filtered.length > 0;

  return (
    <div style={{ backgroundColor: COLORS.bg, ...bodyFont, color: COLORS.dark }} className="min-h-screen w-full">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');`}</style>

      <AdminHeader active="Ingredients" />

      <div className="max-w-[1440px] mx-auto px-5 md:px-8 pt-8 pb-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
          <div>
            <h1 style={{ ...displayFont, color: COLORS.dark }} className="text-2xl md:text-3xl font-bold">
              Ingredients
            </h1>
            <p style={{ color: COLORS.secondary }} className="text-sm mt-1">
              {ingredients.length} ingredient{ingredients.length === 1 ? "" : "s"} tracked
            </p>
          </div>
          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105 shrink-0"
            style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
          >
            <Plus size={16} weight="bold" /> Add Ingredient
          </button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2" color={COLORS.secondary} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ingredients by name..."
              className="w-full h-12 rounded-2xl border pl-11 pr-4 text-sm outline-none focus:border-[#F38D39] transition-colors duration-200"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.card }}
              aria-label="Search ingredients"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : !hasAny ? (
          <EmptyState
            Icon={Package}
            title="No ingredients yet"
            subtitle="Start building your pantry list by adding your first ingredient."
            action={
              <button
                onClick={openAddForm}
                className="flex items-center gap-2 px-6 py-3 rounded-full text-white text-sm font-semibold shadow-md transition-transform duration-200 hover:scale-105"
                style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
              >
                <Plus size={16} weight="bold" /> Add Your First Ingredient
              </button>
            }
          />
        ) : !hasResults ? (
          <EmptyState
            Icon={Search}
            title="No matching ingredients"
            subtitle="Try a different search term."
            action={
              <button
                onClick={() => setSearch("")}
                className="px-6 py-2.5 rounded-full text-sm font-semibold border transition-colors duration-200"
                style={{ borderColor: COLORS.border, color: COLORS.dark, ...displayFont }}
              >
                Clear search
              </button>
            }
          />
        ) : (
          <>
            <div className="hidden md:block rounded-3xl overflow-hidden shadow-sm" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: COLORS.cream }}>
                    <th className="text-left px-6 py-4 font-semibold" style={{ ...displayFont, color: COLORS.dark }}>Name</th>
                    <th className="text-left px-6 py-4 font-semibold" style={{ ...displayFont, color: COLORS.dark }}>Unit of Measurement</th>
                    <th className="text-left px-6 py-4 font-semibold" style={{ ...displayFont, color: COLORS.dark }}>Added</th>
                    <th className="text-right px-6 py-4 font-semibold" style={{ ...displayFont, color: COLORS.dark }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageItems.map((i) => (
                    <tr key={i.id} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.cream }}>
                            <Package size={18} color={COLORS.primaryDark} />
                          </div>
                          <span className="font-semibold" style={{ ...displayFont, color: COLORS.dark }}>{i.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: COLORS.sage, color: COLORS.sageText, ...displayFont }}>
                          {i.unit}
                        </span>
                      </td>
                      <td className="px-6 py-4" style={{ color: COLORS.secondary }}>{formatDate(i.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <RowIconButton label="Edit" onClick={() => openEditForm(i)}>
                            <Edit size={16} color={COLORS.primaryDark} />
                          </RowIconButton>
                          <RowIconButton label="Delete" onClick={() => setConfirmTarget(i)} danger>
                            <Trash size={16} color={COLORS.roseText} />
                          </RowIconButton>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="md:hidden flex flex-col gap-4">
              {pageItems.map((i) => (
                <div key={i.id} className="rounded-3xl p-4 shadow-sm flex gap-4 items-start" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: COLORS.cream }}>
                    <Package size={20} color={COLORS.primaryDark} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm mb-1 truncate" style={{ ...displayFont, color: COLORS.dark }}>{i.name}</h4>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: COLORS.sage, color: COLORS.sageText, ...displayFont }}>
                      {i.unit}
                    </span>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => openEditForm(i)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: COLORS.cream, color: COLORS.primaryDark, ...displayFont }}
                      >
                        <Edit size={13} /> Edit
                      </button>
                      <button
                        onClick={() => setConfirmTarget(i)}
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

      <IngredientFormModal
        open={formOpen}
        ingredient={editingIngredient}
        saving={saving}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
      />

      <ConfirmDialog
        open={!!confirmTarget}
        title="Delete this ingredient?"
        message={confirmTarget ? `"${confirmTarget.name}" will be permanently removed. This can't be undone.` : ""}
        confirmLabel="Delete Ingredient"
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
        <div key={i} className="h-20 rounded-3xl animate-pulse" style={{ backgroundColor: COLORS.card, border: `1px solid ${COLORS.border}` }} />
      ))}
    </div>
  );
}
