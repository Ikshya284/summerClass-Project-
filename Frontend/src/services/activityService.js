/**
 * Lightweight activity log used to power the Admin Dashboard's
 * "Activity Overview" section. Recipe/ingredient services call
 * `logActivity` whenever something is created, updated, or deleted so the
 * dashboard always reflects what's really happened, instead of static copy.
 */

const ACTIVITY_KEY = "cookcraft_activity_log";
const MAX_ENTRIES = 50;

function readLog() {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeLog(entries) {
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
}

/**
 * @param {Object} entry
 * @param {"recipe"|"ingredient"|"auth"} entry.type
 * @param {"create"|"update"|"delete"} entry.action
 * @param {string} entry.message - human readable summary
 */
export function logActivity({ type, action, message }) {
  const entries = readLog();
  entries.unshift({
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    action,
    message,
    timestamp: new Date().toISOString(),
  });
  writeLog(entries);
}

export function getRecentActivity(limit = 8) {
  return readLog().slice(0, limit);
}

export function clearActivity() {
  localStorage.removeItem(ACTIVITY_KEY);
}
