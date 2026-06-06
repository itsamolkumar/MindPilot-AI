import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@/tests/test-utils";
import { EmptyState } from "@/components/EmptyState";

describe("EmptyState component", () => {
  it("renders the empty state prompt and check-in link", () => {
    render(<EmptyState />);

    expect(screen.getByRole("heading", { name: /Start with today’s check-in/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Create check-in/i })).toBeInTheDocument();
  });
});
