import { describe, it, expect } from "vitest";
import { forecastMood } from "@/lib/moodForecastEngine";

const createEntry = (overrides = {}) => ({
  mood: 6,
  stress: 5,
  sleepHours: 7,
  studyHours: 4,
  energyLevel: 6,
  motivationLevel: 6,
  createdAt: new Date().toISOString(),
  ...overrides,
});

describe("Mood Forecasting", () => {
  it("returns unknown forecast for empty history", () => {
    const result = forecastMood([]);
    expect(result.tomorrow.futureMood).toBe("Unknown");
    expect(result.tomorrow.confidence).toBe(0);
    expect(result.threeDays.futureMood).toBe("Unknown");
  });

  it("generates a positive forecast for a single strong entry", () => {
    const result = forecastMood([createEntry({ mood: 9, stress: 4, sleepHours: 8, energyLevel: 8, motivationLevel: 8 })]);
    expect(result.tomorrow.futureMood).toBe("Positive");
    expect(result.tomorrow.confidence).toBeGreaterThan(40);
  });

  it("generates a low forecast for multiple declining entries", () => {
    const entries = [
      createEntry({ mood: 7, stress: 5, sleepHours: 7, energyLevel: 6, motivationLevel: 6, createdAt: "2026-06-02T09:00:00.000Z" }),
      createEntry({ mood: 4, stress: 8, sleepHours: 5, energyLevel: 4, motivationLevel: 3, createdAt: "2026-06-03T09:00:00.000Z" }),
    ];

    const result = forecastMood(entries);
    expect(result.tomorrow.futureMood).toBe("Low");
    expect(result.tomorrow.confidence).toBeGreaterThanOrEqual(42);
  });
});
