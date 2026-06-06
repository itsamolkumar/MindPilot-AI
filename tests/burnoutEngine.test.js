import { describe, it, expect } from "vitest";
import { calculateBurnoutRisk } from "@/lib/burnoutEngine";

function makeEntry(overrides = {}) {
  return {
    mood: 7,
    stress: 5,
    sleepHours: 7.5,
    studyHours: 4,
    energyLevel: 7,
    motivationLevel: 7,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

describe("Burnout Prediction Engine", () => {
  it("calculates low risk for balanced entries", () => {
    const entries = Array.from({ length: 7 }, () => makeEntry());
    const result = calculateBurnoutRisk(entries);

    expect(result.riskPercent).toBe(0);
    expect(result.riskLevel).toBe("Low");
    expect(result.reasons[0]).toContain("stable wellness signals");
  });

  it("calculates medium risk for mildly elevated stress and low sleep", () => {
    const entries = Array.from({ length: 7 }, () =>
      makeEntry({ stress: 6, sleepHours: 6, studyHours: 5, energyLevel: 6, motivationLevel: 6, mood: 5 })
    );
    const result = calculateBurnoutRisk(entries);

    expect(result.riskPercent).toBeGreaterThanOrEqual(25);
    expect(result.riskPercent).toBeLessThan(50);
    expect(result.riskLevel).toBe("Moderate");
  });

  it("calculates high risk for extreme stress, poor sleep, and low energy", () => {
    const entries = Array.from({ length: 7 }, () =>
      makeEntry({ stress: 8, sleepHours: 4.5, studyHours: 8, energyLevel: 3, motivationLevel: 3, mood: 3 })
    );
    const result = calculateBurnoutRisk(entries);

    expect(result.riskPercent).toBeGreaterThanOrEqual(75);
    expect(result.riskLevel).toBe("Critical");
    expect(result.reasons).toEqual(expect.arrayContaining([expect.stringContaining("Stress has stayed very high")]))
  });

  it("handles invalid input by returning no data", () => {
    const result = calculateBurnoutRisk(null);
    expect(result.riskPercent).toBe(0);
    expect(result.riskLevel).toBe("No Data");
  });

  it("handles boundary values around sleep recovery", () => {
    const entries = Array.from({ length: 7 }, () =>
      makeEntry({ stress: 6, sleepHours: 6.5, studyHours: 6, energyLevel: 6, motivationLevel: 6, mood: 5 })
    );
    const result = calculateBurnoutRisk(entries);

    expect(result.riskLevel).toBe("Moderate");
    expect(result.riskPercent).toBeGreaterThanOrEqual(25);
    expect(result.riskPercent).toBeLessThan(50);
  });
});
