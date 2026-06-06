import { describe, it, expect } from "vitest";
import { generateRecoveryPlan } from "@/lib/recoveryPlanEngine";

describe("Recovery plan engine", () => {
  it("builds a supportive plan for high burnout and low sleep", () => {
    const plan = generateRecoveryPlan(
      {
        stress: 8,
        sleepHours: 5,
        energyLevel: 3,
        motivationLevel: 4,
      },
      { riskLevel: "High" },
      { recommendations: ["Start with a short break.", "Ask for help."] }
    );

    expect(plan).toEqual(expect.arrayContaining([
      expect.stringContaining("Reduce today to the two most important academic tasks"),
      expect.stringContaining("Protect tonight’s sleep window"),
      expect.stringContaining("Start with a 15 minute study sprint"),
    ]));
  });

  it("returns a stable plan for balanced entries", () => {
    const plan = generateRecoveryPlan(
      {
        stress: 4,
        sleepHours: 7,
        energyLevel: 7,
        motivationLevel: 7,
      },
      { riskLevel: "Low" },
      null
    );

    expect(plan).toContain("Keep the current routine stable and check in again tomorrow.");
  });
});
