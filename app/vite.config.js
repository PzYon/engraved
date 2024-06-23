import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

// we want a separate chunk for the envSettings stuff in
// order to be able to reload it independent of the other
// chunks. this enables us to detect, if a new version
// has been deployed.
const envSettings = "envSettings";

export default () =>
  defineConfig({
    server: {
      port: 3000,
    },
    plugins: [react(), checker({ typescript: true })],
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: () => `[name].js`,
          manualChunks: (id) =>
            id.includes(envSettings) ? envSettings : undefined,
        },
      },
    },
  });
