import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/tests/test-utils";
import { AppShell } from "@/components/AppShell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/panic",
}));

describe("AppShell navigation", () => {
  it("renders navigation links and marks active page", () => {
    render(<AppShell><div>Child</div></AppShell>);

    expect(screen.getByRole("link", { name: /Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Panic Mode/i })).toHaveAttribute("aria-current", "page");
    expect(screen.getByText("Child")).toBeInTheDocument();
  });
});
