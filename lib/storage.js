export const STORAGE_KEYS = {
  CHECK_INS: "mindpilot.checkIns",
  ANALYSES: "mindpilot.analyses",
  PANIC_PLANS: "mindpilot.panicPlans",
};

export const DEFAULT_CHECK_IN = {
  mood: 6,
  stress: 5,
  sleepHours: 7,
  studyHours: 4,
  energyLevel: 6,
  motivationLevel: 6,
  journalEntry: "",
  examDate: "",
};

export function createCheckIn(payload) {
  return {
    id: crypto.randomUUID(),
    mood: Number(payload.mood),
    stress: Number(payload.stress),
    sleepHours: Number(payload.sleepHours),
    studyHours: Number(payload.studyHours),
    energyLevel: Number(payload.energyLevel),
    motivationLevel: Number(payload.motivationLevel),
    journalEntry: String(payload.journalEntry || "").trim(),
    examDate: payload.examDate || "",
    createdAt: new Date().toISOString(),
  };
}

export function readCollection(key) {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function writeCollection(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getCheckIns() {
  return readCollection(STORAGE_KEYS.CHECK_INS);
}

export function saveCheckIn(checkIn) {
  const current = getCheckIns();
  const next = [checkIn, ...current].slice(0, 365);
  writeCollection(STORAGE_KEYS.CHECK_INS, next);
  return next;
}

export function getAnalyses() {
  return readCollection(STORAGE_KEYS.ANALYSES);
}

export function saveAnalysis(analysis) {
  const current = getAnalyses();
  const next = [analysis, ...current].slice(0, 365);
  writeCollection(STORAGE_KEYS.ANALYSES, next);
  return next;
}

export function getLatestCheckIn() {
  return getCheckIns()[0] || null;
}

export function clearMindPilotData() {
  if (typeof window === "undefined") {
    return;
  }

  Object.values(STORAGE_KEYS).forEach((key) => window.localStorage.removeItem(key));
}
