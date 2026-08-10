import { useEffect, useMemo, useState } from "react";
import { X } from "phosphor-react";
import { INGREDIENT_UNITS } from "../utils/constants";
import { COLORS, displayFont, bodyFont } from "../utils/theme";
import { validateName, validateRequired } from "../utils/validators";

const inputClass =
  "w-full h-12 rounded-2xl px-4 text-sm bg-white outline-none transition-colors duration-200 border focus:border-[#F38D39]";

const emptyForm = { name: "", unit: "pcs" };

export default function IngredientFormModal({ open, ingredient, saving, onSubmit, onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(
        ingredient
          ? {
              name: ingredient.name || "",
              unit: ingredient.unit || "pcs",
            }
          : emptyForm
      );
      setErrors({});
    }
  }, [open, ingredient]);

  if (!open) return null;

  const update = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: null }));
  };

  function validate() {
    const nextErrors = {
      name: validateName(form.name, "Ingredient name"),
      unit: validateRequired(form.unit, "Unit of measurement"),
    };
    setErrors(nextErrors);
    return !Object.values(nextErrors).some(Boolean);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      name: form.name.trim(),
      unit: form.unit,
    });
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(45,45,45,0.45)" }}
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-3xl p-6 md:p-7 shadow-2xl max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: COLORS.card, ...bodyFont }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 style={{ ...displayFont, color: COLORS.dark }} className="text-lg font-bold">
            {ingredient ? "Edit Ingredient" : "Add Ingredient"}
          </h3>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.cream }}>
            <X size={16} color={COLORS.primaryDark} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ ...displayFont, color: COLORS.dark }}>
              Ingredient Name <span style={{ color: COLORS.roseText }}>*</span>
            </label>
            <input
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Tomato"
              className={inputClass}
              style={{ borderColor: errors.name ? COLORS.roseText : COLORS.border }}
            />
            {errors.name && <p className="text-xs mt-1" style={{ color: COLORS.roseText }}>{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1.5" style={{ ...displayFont, color: COLORS.dark }}>
              Unit of Measurement <span style={{ color: COLORS.roseText }}>*</span>
            </label>
            <select
              value={form.unit}
              onChange={(e) => update("unit", e.target.value)}
              className={`${inputClass} appearance-none cursor-pointer`}
              style={{ borderColor: errors.unit ? COLORS.roseText : COLORS.border }}
            >
              {INGREDIENT_UNITS.map((u) => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
            {errors.unit && <p className="text-xs mt-1" style={{ color: COLORS.roseText }}>{errors.unit}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-full text-sm font-semibold border disabled:opacity-60"
              style={{ borderColor: COLORS.border, color: COLORS.dark, ...displayFont }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-full text-sm font-semibold text-white shadow-sm transition-transform duration-200 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
              style={{ backgroundImage: `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.primaryDark})`, ...displayFont }}
            >
              {saving ? "Saving..." : ingredient ? "Save Changes" : "Add Ingredient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
