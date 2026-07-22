import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: {
      // "virtual:pwa-register" is injected by the VitePWA plugin at build time
      // and doesn't exist under vitest; point it at a no-op stub instead.
      "virtual:pwa-register": fileURLToPath(
        new URL("./src/test/virtualPwaRegisterStub.ts", import.meta.url),
      ),
    },
  },
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
