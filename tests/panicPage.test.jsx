import React from "react";
import { describe, it, expect } from "vitest";
import { fireEvent, render, screen, waitFor } from "@/tests/test-utils";

const { default: PanicPage } = await import("@/app/panic/page.jsx");

describe("Panic mode rendering", () => {
  it("renders the panic page and allows grounding activation", async () => {
    render(<PanicPage />);

    const button = screen.getByRole("button", { name: /Start grounding/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    await waitFor(() => expect(button).not.toBeDisabled(), { timeout: 2000 });
    expect(screen.getByText(/Call 988/i)).toBeInTheDocument();
  });
});
