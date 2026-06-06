import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.matchMedia =
  global.matchMedia ||
  function () {
    return {
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
      addListener: () => {},
      removeListener: () => {},
    };
  };

vi.mock("next/link", () => ({
  default: ({ children, href, ...props }) => React.createElement("a", { href, ...props }, children),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));
