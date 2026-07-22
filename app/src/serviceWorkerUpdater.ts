/// <reference types="vite-plugin-pwa/client" />
import { registerSW } from "virtual:pwa-register";

// The app is a PWA whose service worker precaches index.html and all hashed
// chunks cache-first (see vite.config.js). Because of that, a plain
// location.reload() after a deploy is unreliable: the reload navigation is
// answered by the still-active worker from the OLD precache, so the page can
// land right back on the stale version whose lazily imported chunks were
// deleted by the deploy ("Failed to fetch dynamically imported module").
//
// To update deterministically we drive the service-worker lifecycle: make the
// freshly deployed worker skipWaiting and only reload once it controls the page
// (registerType is "prompt", so the new worker waits for our signal instead of
// auto-activating and reloading the page out from under the user).

// Only activate + reload after the user explicitly asks to update. Background
// update checks must never reload the page on their own.
let userRequestedUpdate = false;

let swRegistration: ServiceWorkerRegistration | undefined;

const updateServiceWorker = registerSW({
  immediate: true,
  onRegisteredSW: (_swScriptUrl, registration) => {
    swRegistration = registration;
  },
  onNeedRefresh: () => {
    // A newly deployed worker finished installing and is now waiting. If the
    // user already clicked "update", activate it now; the plugin reloads the
    // page once the new worker takes control.
    if (userRequestedUpdate) {
      void updateServiceWorker(true);
    }
  },
  onRegisterError: (error) => {
    console.warn("Service worker registration failed.", error);
  },
});

/**
 * Update the app to the freshly deployed version and reload once the new
 * service worker controls the page. Safe to call even when service workers are
 * unavailable (falls back to a plain reload).
 */
export async function applyNewVersion(): Promise<void> {
  userRequestedUpdate = true;

  const registration = swRegistration;

  // No service worker in play (unsupported browser or registration failed):
  // a normal reload is the best we can do.
  if (!registration) {
    location.reload();
    return;
  }

  // A worker is already installed and waiting -> activate it + reload.
  if (registration.waiting) {
    await updateServiceWorker(true);
    return;
  }

  // Otherwise ask the browser to look for the freshly deployed worker. If one
  // is found it installs and fires onNeedRefresh above, which finishes the
  // update (skipWaiting -> controllerchange -> reload).
  try {
    await registration.update();
  } catch (error) {
    console.warn("Service worker update check failed.", error);
  }

  // Fallback: if no new worker materialised (already up to date locally, or the
  // update check failed), reload so the user is never stuck on the button.
  if (!registration.waiting && !registration.installing) {
    location.reload();
  }
}
