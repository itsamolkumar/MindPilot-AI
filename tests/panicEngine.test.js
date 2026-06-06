import { describe, it, expect } from "vitest";
import { buildPanicPlan } from "@/lib/panicEngine";

const sampleEntries = [
  {
    mood: 2,
    stress: 9,
    sleepHours: 4,
    studyHours: 8,
    energyLevel: 2,
    motivationLevel: 3,
    createdAt: "2026-06-05T09:00:00.000Z",
  },
];

const urgentAnalysis = [
  { risk: "Urgent" },
];

describe("Panic plan engine", () => {
  it("returns urgent guidance when journal analysis is urgent", () => {
    const plan = buildPanicPlan(sampleEntries, urgentAnalysis);

    expect(plan.fiveMinute).toContain("Contact emergency or crisis support now.");
    expect(plan.oneHour).toContain("Ask for academic or counseling support today.");
    expect(plan.twentyFourHour).toContain("Reduce tomorrow’s task list to three essential items.");
  });
});
