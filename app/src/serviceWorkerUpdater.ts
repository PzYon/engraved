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
 * Called when an update the user asked for did not happen. The message is meant
 * to be shown to them, so it says what to do about it rather than what broke.
 */
export type UpdateFailedHandler = (message: string) => void;

// A worker that fetches imports while installing - ours pulls the OneSignal SDK
// from a CDN, see vite.config.js - can be slow on a bad connection, but not this
// slow. Past this we report instead of leaving the button looking dead.
const installTimeoutMs = 30_000;

/**
 * Update the app to the freshly deployed version and reload once the new
 * service worker controls the page. Safe to call even when service workers are
 * unavailable (falls back to a plain reload). Reports through `onFailed` when
 * the update cannot be completed, so that the caller can tell the user.
 */
export async function applyNewVersion(
  onFailed?: UpdateFailedHandler,
): Promise<void> {
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

  // update() resolves once the check is done, which is normally well before the
  // worker it found has finished installing. Waiting for that here is what keeps
  // the button from silently doing nothing: an install that fails - a throwing
  // importScripts takes the worker straight to "redundant" - means onNeedRefresh
  // never fires, and without this nothing would happen and nothing be reported.
  if (registration.installing) {
    await waitForInstall(registration.installing, onFailed);
    return;
  }

  // Installed while we were waiting on update() - activate it + reload.
  if (registration.waiting) {
    await updateServiceWorker(true);
    return;
  }

  // Nothing new to install: we already run the newest worker the server offers,
  // so a plain reload is both correct here and all we can do.
  location.reload();
}

// Resolves once the worker has installed (onNeedRefresh then finishes the
// update), and reports through onFailed when it dies or takes too long instead.
function waitForInstall(
  worker: ServiceWorker,
  onFailed?: UpdateFailedHandler,
): Promise<void> {
  return new Promise((resolve) => {
    const timeout = window.setTimeout(
      () =>
        finish(
          "The new version is taking too long to install. Please try again.",
        ),
      installTimeoutMs,
    );

    function finish(failure?: string) {
      window.clearTimeout(timeout);
      worker.removeEventListener("statechange", checkState);

      if (failure) {
        console.error(
          `Service worker update failed (state "${worker.state}").`,
          failure,
        );
        onFailed?.(failure);
      }

      resolve();
    }

    function checkState() {
      switch (worker.state) {
        // "installed" means it is waiting to activate: onNeedRefresh has fired
        // by now and, because the user asked for this, already triggered the
        // skipWaiting + reload. "activated" means that is under way.
        case "installed":
        case "activated":
          finish();
          break;

        // The install failed. A throwing importScripts is how that happens here.
        case "redundant":
          finish(
            "The new version could not be installed - it probably could not be downloaded. Please check your connection and try again.",
          );
          break;
      }
    }

    worker.addEventListener("statechange", checkState);

    // The worker can have moved on between us reading registration.installing
    // and subscribing here, in which case no further statechange is coming.
    checkState();
  });
}
