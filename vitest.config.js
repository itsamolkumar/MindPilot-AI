import { defineConfig } from "vitest/config";
import path from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./setupTests.js",
    alias: {
      "@": path.resolve(__dirname, "."),
    },
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      all: true,
      exclude: ["node_modules/", "vitest.config.js", "setupTests.js", ".next/"],
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
});
