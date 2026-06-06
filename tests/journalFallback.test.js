import { describe, it, expect } from "vitest";
import { analyzeJournalFallback } from "@/lib/journalFallback";

describe("AI Recommendation Engine fallback", () => {
  it("flags urgent risk for high-risk journal phrases", () => {
    const result = analyzeJournalFallback("I feel like I want to kill myself and I can't go on.");
    expect(result.risk).toBe("Urgent");
    expect(result.recommendations.some((item) => item.toLowerCase().includes("panic"))).toBe(true);
  });

  it("returns supportive recommendations for normal entries", () => {
    const result = analyzeJournalFallback("I am stressed about exams but trying to keep up.");
    expect(result.risk).toBe("Low");
    expect(result.recommendations).toHaveLength(2);
  });
});
