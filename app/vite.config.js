import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";

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
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        // Keep our hand-written public/manifest.json (linked from index.html)
        // rather than generating one.
        manifest: false,
        workbox: {
          // Unified service worker: this single Workbox-generated worker also
          // loads the OneSignal SDK worker, so offline caching and web push
          // share ONE service worker at scope "/". OneSignal.init is pointed at
          // this worker (see src/util/oneSignal.ts) and the standalone
          // public/OneSignalSDKWorker.js has been removed. Two workers can't
          // both control scope "/" (the last to register wins), hence the merge.
          importScripts: [
            "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.sw.js",
          ],
          globPatterns: ["**/*.{js,css,html,svg,png,ico,woff,woff2,ttf}"],
          // The un-hashed envSettings chunk is our deploy-detection probe
          // (VersionChecker.tsx fetches it with cache: "no-store"). It must
          // never be served cache-first or new deployments would be hidden, so
          // we exclude it from the precache and fetch it network-first below
          // (falling back to cache only when offline).
          globIgnores: ["**/envSettings.js"],
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/api/],
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ url }) =>
                url.pathname === "/chunks/envSettings.js",
              handler: "NetworkFirst",
              options: {
                cacheName: "engraved-env-settings",
                expiration: { maxEntries: 2 },
              },
            },
          ],
        },
      }),
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
