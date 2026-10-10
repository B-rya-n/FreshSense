import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/*.ui.test.{js,jsx}", "tests/**/*.ui.test.{js,jsx}"],
    passWithNoTests: true,
  },
});
