import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor } from "@/tests/test-utils";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

const fetchMock = vi.fn(async () => ({
  ok: true,
  json: async () => ({
    emotion: "Neutral",
    trigger: "Not clear",
    sentiment: "Neutral",
    risk: "Low",
    recommendations: ["Keep moving forward."],
  }),
}));

describe("Mood form submission", () => {
  beforeEach(() => {
    global.fetch = fetchMock;
    fetchMock.mockClear();
  });

  it("submits a check-in and calls the API analysis endpoint", async () => {
    const { default: CheckInPage } = await import("@/app/check-in/page.jsx");
    const user = userEvent.setup();

    render(<CheckInPage />);

    await user.type(screen.getByLabelText(/Journal Entry/i), "I am a bit stressed but ready.");
    await user.click(screen.getByRole("button", { name: /Save check-in/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(fetchMock.mock.calls[0][0]).toContain("/api/analyze");
  });
});
