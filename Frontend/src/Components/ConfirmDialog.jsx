import { Warning } from "phosphor-react";
import { COLORS, displayFont, bodyFont } from "../utils/theme";

/**
 * Reusable confirmation dialog for destructive actions (delete recipe,
 * delete ingredient, ...). Renders nothing when `open` is false.
 */
export default function ConfirmDialog({
  open,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(45,45,45,0.45)" }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-3xl p-6 shadow-2xl"
        style={{ backgroundColor: COLORS.card, ...bodyFont }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
          style={{ backgroundColor: danger ? COLORS.rose : COLORS.cream }}
        >
          <Warning size={22} weight="fill" color={danger ? COLORS.roseText : COLORS.primaryDark} />
        </div>
        <h3 id="confirm-dialog-title" style={{ ...displayFont, color: COLORS.dark }} className="text-lg font-bold mb-2">
          {title}
        </h3>
        {message && (
          <p style={{ color: COLORS.secondary }} className="text-sm leading-relaxed mb-6">
            {message}
          </p>
        )}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors duration-200 disabled:opacity-60"
            style={{ borderColor: COLORS.border, color: COLORS.dark, ...displayFont }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-sm transition-transform duration-200 hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
            style={{
              backgroundColor: danger ? COLORS.roseText : COLORS.primary,
              ...displayFont,
            }}
          >
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
