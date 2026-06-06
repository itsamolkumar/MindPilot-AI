/**
 * Normalize a value into a finite number.
 * @param {unknown} value
 * @param {number} fallback
 * @returns {number}
 */
export function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

/**
 * Safely parse JSON or return fallback.
 * @template T
 * @param {string} input
 * @param {T} fallback
 * @returns {T}
 */
export function safeJSONParse(input, fallback) {
  try {
    return JSON.parse(input);
  } catch {
    return fallback;
  }
}

/**
 * Sort check-in entries by createdAt date.
 * @param {Array<Record<string, any>>} entries
 * @param {boolean} descending
 * @returns {Array<Record<string, any>>}
 */
export function sortEntriesByDate(entries, descending = true) {
  return [...(entries || [])]
    .filter(Boolean)
    .sort((a, b) => {
      const aDate = new Date(a.createdAt).getTime();
      const bDate = new Date(b.createdAt).getTime();
      return descending ? bDate - aDate : aDate - bDate;
    });
}

/**
 * Compute average over a numeric field in a collection.
 * @param {Array<Record<string, any>>} entries
 * @param {string} field
 * @returns {number}
 */
export function averageField(entries, field) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return 0;
  }

  return (
    entries.reduce((sum, entry) => sum + normalizeNumber(entry[field]), 0) /
    entries.length
  );
}

/**
 * Constrain a number to a range.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Find the next upcoming exam date from a list of entries.
 * @param {Array<Record<string, any>>} entries
 * @returns {{displayDate: string, daysToExam: number, isSoon: boolean} | null}
 */
export function getUpcomingExam(entries) {
  if (!Array.isArray(entries)) {
    return null;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = entries
    .map((entry) => {
      const date = entry?.examDate ? new Date(entry.examDate) : null;
      return { entry, examDate: date };
    })
    .filter((item) => item.examDate instanceof Date && !Number.isNaN(item.examDate.getTime()))
    .filter((item) => item.examDate.getTime() >= today.getTime())
    .sort((a, b) => a.examDate - b.examDate)[0];

  if (!upcoming?.examDate) {
    return null;
  }

  const diffMs = upcoming.examDate.getTime() - today.getTime();
  const daysToExam = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));

  return {
    displayDate: upcoming.examDate.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    daysToExam,
    isSoon: daysToExam <= 7,
  };
}
