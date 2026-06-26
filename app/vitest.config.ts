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
  },
});
