import { describe, it, expect } from "vitest";
import { calculateExamReadiness } from "@/lib/examReadinessEngine";

const sampleEntry = {
  mood: 8,
  stress: 4,
  sleepHours: 7,
  studyHours: 5,
  energyLevel: 8,
  motivationLevel: 8,
  createdAt: new Date().toISOString(),
};

describe("Wellness Score Calculator", () => {
  it("calculates the expected readiness score for balanced entries", () => {
    const entries = Array.from({ length: 5 }, () => sampleEntry);
    const score = calculateExamReadiness(entries);
    expect(score).toBe(71);
  });

  it("handles edge cases with low sleep and high stress", () => {
    const entries = Array.from({ length: 5 }, () => ({
      ...sampleEntry,
      stress: 8,
      sleepHours: 5,
      studyHours: 7,
      energyLevel: 4,
      motivationLevel: 4,
      mood: 4,
    }));
    const score = calculateExamReadiness(entries);
    expect(score).toBeGreaterThanOrEqual(20);
    expect(score).toBeLessThan(50);
  });

  it("returns zero when values are missing", () => {
    const entries = [
      { createdAt: new Date().toISOString() },
      { createdAt: new Date().toISOString() },
      { createdAt: new Date().toISOString() },
      { createdAt: new Date().toISOString() },
      { createdAt: new Date().toISOString() },
    ];
    const score = calculateExamReadiness(entries);
    expect(score).toBe(0);
  });
});
