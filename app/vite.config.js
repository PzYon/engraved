import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";

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
    plugins: [
      react({
        babel: {
          plugins: ["babel-plugin-react-compiler"],
        },
      }),
      checker({ typescript: true }),
    ],
    build: {
      rollupOptions: {
        output: {
          entryFileNames: "chunks/[name].[hash].js",
          chunkFileNames: (chunkInfo) =>
            chunkInfo.name === envSettings
              ? `chunks/[name].js`
              : `chunks/[name].[hash].js`,
          manualChunks: (id) =>
            id.includes(envSettings) ? envSettings : undefined,
        },
      },
    },
  });
};
