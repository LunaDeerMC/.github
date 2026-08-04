import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.spec.ts"],
    exclude: ["node_modules/**", "dist/**", "prototypes/**", "tests/e2e/**"],
  },
});
