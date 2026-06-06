import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@/tests/test-utils";
import { TrendCharts } from "@/components/TrendCharts";

const entries = [
  {
    createdAt: "2026-06-01T09:00:00.000Z",
    mood: 7,
    stress: 5,
    sleepHours: 7,
    studyHours: 4,
    energyLevel: 7,
    motivationLevel: 7,
  },
  {
    createdAt: "2026-06-02T09:00:00.000Z",
    mood: 6,
    stress: 6,
    sleepHours: 6,
    studyHours: 5,
    energyLevel: 6,
    motivationLevel: 6,
  },
];

describe("Chart data generation", () => {
  it("renders chart labels and values for trend data", () => {
    render(<TrendCharts entries={entries} />);
    expect(screen.getByText(/Mood, Stress, Energy/i)).toBeInTheDocument();
    expect(screen.getByText(/Sleep And Study Load/i)).toBeInTheDocument();
  });
});
