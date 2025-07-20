import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    coverage: {
      reporter: ["text", "json", "html"],
    },
    globals: true,
    // setupFiles: ['./src/setupTests.ts'], // Uncomment if you have a setup file
  },
});
