import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@/tests/test-utils";
import { MetricCard } from "@/components/MetricCard";

describe("Burnout card rendering", () => {
  it("renders title, value, and detail with the correct tone", () => {
    render(<MetricCard title="Burnout Risk" value="42%" detail="Moderate" tone="warn" />);
    expect(screen.getByText("Burnout Risk")).toBeInTheDocument();
    expect(screen.getByText("42%")).toBeInTheDocument();
    expect(screen.getByText("Moderate")).toBeInTheDocument();
  });
});
