import { COLORS, displayFont } from "../utils/theme";

/**
 * Reusable empty-state block, shown when a list has no data (or no results
 * match the current search/filter).
 */
export default function EmptyState({ Icon, title, subtitle, action }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center rounded-3xl py-16 px-6"
      style={{ backgroundColor: COLORS.card, border: `1px dashed ${COLORS.border}` }}
    >
      {Icon && (
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5" style={{ backgroundColor: COLORS.cream }}>
          <Icon size={28} color={COLORS.primaryDark} />
        </div>
      )}
      <h3 style={{ ...displayFont, color: COLORS.dark }} className="text-lg font-bold mb-2">
        {title}
      </h3>
      {subtitle && (
        <p style={{ color: COLORS.secondary }} className="text-sm max-w-sm mb-6">
          {subtitle}
        </p>
      )}
      {action}
    </div>
  );
}
