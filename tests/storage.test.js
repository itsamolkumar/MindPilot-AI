import { describe, it, expect, beforeEach } from "vitest";
import {
  STORAGE_KEYS,
  getCheckIns,
  saveCheckIn,
  getAnalyses,
  saveAnalysis,
  clearMindPilotData,
} from "@/lib/storage";

describe("LocalStorage Service", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and loads a mood entry", () => {
    const entry = {
      id: "test-1",
      mood: 8,
      stress: 4,
      sleepHours: 7,
      studyHours: 4,
      energyLevel: 8,
      motivationLevel: 8,
      journalEntry: "Good day.",
      examDate: "",
      createdAt: new Date().toISOString(),
    };

    saveCheckIn(entry);
    const loaded = getCheckIns();

    expect(loaded).toHaveLength(1);
    expect(loaded[0]).toMatchObject(entry);
  });

  it("deletes saved data using clearMindPilotData", () => {
    const entry = { id: "test-2", mood: 5, stress: 6, sleepHours: 6, studyHours: 5, energyLevel: 5, motivationLevel: 5, journalEntry: "okay", examDate: "", createdAt: new Date().toISOString() };
    saveCheckIn(entry);
    saveAnalysis({ id: "analysis-1", checkInId: "test-2", emotion: "Neutral", trigger: "Not clear", sentiment: "Neutral", risk: "Low", recommendations: ["Keep going."], createdAt: new Date().toISOString() });

    clearMindPilotData();
    expect(localStorage.getItem(STORAGE_KEYS.CHECK_INS)).toBeNull();
    expect(localStorage.getItem(STORAGE_KEYS.ANALYSES)).toBeNull();
  });

  it("returns an empty array when localStorage contains corrupted data", () => {
    window.localStorage.setItem(STORAGE_KEYS.CHECK_INS, "not-a-valid-json");
    const entries = getCheckIns();
    expect(entries).toEqual([]);
  });
});
