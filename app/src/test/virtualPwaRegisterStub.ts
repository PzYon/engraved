// Test stub for the "virtual:pwa-register" module, which is only provided by
// the VitePWA plugin at build time and is not available under vitest. Aliased
// in vitest.config.ts. registerSW returns a no-op updateSW function.
export function registerSW(): (reloadPage?: boolean) => Promise<void> {
  return () => Promise.resolve();
}
