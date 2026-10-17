import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    server: {
      deps: {
        inline: ["@mui/material", "react-transition-group"],
      },
    },
    coverage: {
      provider: "v8",
      // Without include, files no test imports would not count as uncovered.
      include: ["src/**/*.{ts,tsx}"],
      reporter: [
        ["text-summary", { file: "summary.txt" }],
        ["text", { file: "files.txt", skipFull: true, maxCols: 0 }],
      ],
    },
  },
});
