import { CaretLeft, CaretRight } from "phosphor-react";
import { COLORS, displayFont } from "../utils/theme";
/**
 * Reusable pagination control. Hides itself automatically when there's
 * only one page, so callers can always render it unconditionally.
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 pt-6 flex-wrap">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-200 disabled:opacity-40"
        style={{ borderColor: COLORS.border, color: COLORS.dark }}
      >
        <CaretLeft size={15} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onPageChange(p)}
          aria-current={p === page ? "page" : undefined}
          className="w-9 h-9 rounded-full text-sm font-semibold transition-colors duration-200"
          style={
            p === page
              ? { backgroundColor: COLORS.primary, color: "#fff", ...displayFont }
              : { color: COLORS.secondary, ...displayFont }
          }
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-200 disabled:opacity-40"
        style={{ borderColor: COLORS.border, color: COLORS.dark }}
      >
        <CaretRight size={15} />
      </button>
    </div>
  );
}
