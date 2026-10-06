import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";

// The envSettings chunk keeps a fixed file name because the builds deployed
// before version.json existed import it by exactly that name - renaming it
// would leave those installations unable to start until their service worker
// has updated.
const envSettings = "envSettings";

// Deploy-detection probe: isNewVersionAvailable.ts compares this file with the
// version compiled into the running bundle (src/env/buildInfo.ts).
const versionFile = (version) => ({
  name: "engraved-version-file",
  generateBundle() {
    this.emitFile({
      type: "asset",
      fileName: "version.json",
      source: JSON.stringify({ version }),
    });
  },
});

export default ({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname);

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
      versionFile(env.VITE_VERSION),
      VitePWA({
        // "prompt" (not "autoUpdate"): a freshly deployed worker waits instead
        // of skipping-waiting on its own, so the pages it would take over keep
        // the precached chunks they were built with until the user updates
        // (src/serviceWorkerUpdater.ts, wired to the version button).
        registerType: "prompt",
        // We register the worker ourselves in src/serviceWorkerUpdater.ts, so
        // the plugin must not also inject a registration script (that would
        // register the worker twice).
        injectRegister: false,
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
          // The un-hashed envSettings chunk must never be served cache-first or
          // it would outlive the deployment it belongs to, so we exclude it
          // from the precache and fetch it network-first below (falling back to
          // cache only when offline).
          globIgnores: ["**/envSettings.js"],
          // index.html is precached for offline use only. Both options below
          // would answer navigations from that precache, which pins the app to
          // the version the worker was installed with: a reload could then
          // never bring a new deployment, only a worker update could. The
          // navigation route in runtimeCaching replaces them.
          navigateFallback: null,
          directoryIndex: null,
          cleanupOutdatedCaches: true,
          maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
          runtimeCaching: [
            {
              urlPattern: ({ request }) => request.mode === "navigate",
              handler: "NetworkOnly",
              options: {
                plugins: [
                  {
                    // Ask the server on every navigation. Passing the original
                    // request on would hand the decision to the HTTP cache,
                    // which answers history and tab-restore navigations
                    // ("force-cache") with the index.html of an older
                    // deployment, whose chunks may be gone by now.
                    // redirect: "manual" is what a navigation uses anyway.
                    requestWillFetch: async ({ request }) =>
                      new Request(request.url, {
                        cache: "no-cache",
                        redirect: "manual",
                      }),
                  },
                ],
                // Offline: start the app from the precache, where index.html
                // and the chunks it refers to are of the same version.
                precacheFallback: { fallbackURL: "/index.html" },
              },
            },
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
