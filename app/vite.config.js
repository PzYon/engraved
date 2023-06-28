import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// we want a separate chunk for the envSettings stuff in
// order to be able to reload it independent of the other
// chunks. this enables us to detect, if a new version
// has been deployed.
const envSettings = "envSettings";

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
            return chunkInfo.name === envSettings
              ? `[name].js`
              : `[name].[hash].js`;
          },
          manualChunks: (id) => {
            if (id.includes(envSettings)) {
              return envSettings;
            }
          },
        },
      },
    },
  });
};
