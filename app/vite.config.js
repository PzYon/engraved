import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default () => {
  return defineConfig({
    server: {
      port: 3000,
    },
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("envSettings")) {
              return "envSettings";
            }
          },
        },
      },
    },
  });
};
