import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@/tests/test-utils";
import { sampleEntries, sampleAnalyses } from "@/tests/mockData";

vi.mock("@/lib/storage", () => ({
  getCheckIns: () => sampleEntries,
  getAnalyses: () => sampleAnalyses,
}));

const { default: DashboardPage } = await import("@/app/page.jsx");

describe("Dashboard rendering", () => {
  it("renders the wellness coach and burnout overview", async () => {
    render(<DashboardPage />);

    await waitFor(() => expect(screen.getByText(/Today’s wellness overview/i)).toBeInTheDocument());
    expect(screen.getByText(/AI Wellness Coach/i)).toBeInTheDocument();
    expect(screen.getByText(/Burnout Risk/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Daily check-in/i })).toBeInTheDocument();
  });
});
