import { describe, it, expect, beforeEach } from "vitest";
import { POST } from "@/app/api/analyze/route";

describe("API analyze route", () => {
  beforeEach(() => {
    delete process.env.GEMINI_API_KEY;
  });

  it("returns fallback analysis when Gemini API is unavailable", async () => {
    const request = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ journalEntry: "I am anxious about exams." }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data).toHaveProperty("emotion");
    expect(data).toHaveProperty("recommendations");
    expect(data.risk).not.toBeUndefined();
  });

  it("returns a safe fallback response when request content is invalid", async () => {
    const request = new Request("http://localhost/api/analyze", {
      method: "POST",
      body: "not-json",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.emotion).toBe("Unknown");
    expect(data.risk).toBe("Watch");
    expect(data.recommendations).toContain("The AI analysis could not complete.");
  });
});
