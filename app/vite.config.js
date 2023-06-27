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
          chunkFileNames: (chunkInfo) => {
            return chunkInfo.name === "envSettings"
              ? `[name].js`
              : `[name].[hash].js`;
          },
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
