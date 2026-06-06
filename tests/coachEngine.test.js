import { describe, it, expect } from "vitest";
import { generateCoachResponse, parseCoachCommand } from "@/lib/coachEngine";

const sampleEntries = [
  {
    id: "1",
    mood: 4,
    stress: 8,
    sleepHours: 5,
    studyHours: 7,
    energyLevel: 4,
    motivationLevel: 4,
    journalEntry: "Montoring exam pressure.",
    examDate: "2026-06-10",
    createdAt: "2026-06-04T09:00:00.000Z",
  },
  {
    id: "2",
    mood: 3,
    stress: 9,
    sleepHours: 4.5,
    studyHours: 8,
    energyLevel: 3,
    motivationLevel: 3,
    journalEntry: "Feeling burned out.",
    examDate: "2026-06-10",
    createdAt: "2026-06-05T09:00:00.000Z",
  },
];

const sampleAnalyses = [
  {
    id: "analysis-1",
    checkInId: "2",
    emotion: "Tired",
    trigger: "Exam pressure",
    sentiment: "Negative",
    risk: "Elevated",
    recommendations: ["Take one small recovery action before returning to study."],
    createdAt: "2026-06-05T09:05:00.000Z",
  },
];

describe("AI recommendation engine", () => {
  it("generates personalized plans and risk-aware action items", () => {
    const coach = generateCoachResponse(sampleEntries, sampleAnalyses);
    expect(coach.summary).toContain("wellness history");
    expect(coach.todayAction).toBeTruthy();
    expect(coach.plan3Day.length).toBeGreaterThan(0);
    expect(coach.plan7Day.length).toBeGreaterThan(0);
    expect(coach.risks.burnout).toBe("Critical");
  });

  it("returns a fallback summary when history is empty", () => {
    const coach = generateCoachResponse([], []);
    expect(coach.summary).toContain("Add your first check-in");
    expect(coach.plan3Day.length).toBeGreaterThan(0);
    expect(coach.confidence).toBeGreaterThanOrEqual(58);
  });

  it("resolves smart commands and provides explainable details", () => {
    const coach = generateCoachResponse(sampleEntries, sampleAnalyses);
    const commandResult = parseCoachCommand("/burnout", coach);

    expect(commandResult.title).toBe("Burnout Risk");
    expect(commandResult.details[0]).toContain("Burnout risk");
    expect(commandResult.text).toContain("Burnout risk is");
  });
});
