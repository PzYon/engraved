// self-hosted fonts (bundled via the build) instead of a render-blocking
// external Google Fonts request. "Inter Variable" covers the full weight range.
import "@fontsource-variable/inter/index.css";
import "@fontsource/pacifico/index.css";
import React from "react";
import { Bootstrapper } from "./Bootstrapper";
import { createRoot } from "react-dom/client";
import { ThemeAndStylesProvider } from "./theming/ThemeAndStylesProvider";
import { ServerApi } from "./serverApi/ServerApi";
// side-effect import: registers the service worker at startup
import "./serviceWorkerUpdater";

setUpAppInsightsWhenIdle();

wakeUpApi();

createRoot(document.getElementById("root")!).render(getInitialJsx());

function wakeUpApi() {
  const start = performance.now();
  ServerApi.wakeMeUp()
    .then(() => {
      const end = performance.now();
      console.log(`API has woken up after ${Math.round(end - start)}ms`);
    })
    // Best-effort warm-up ping: if the API is unreachable, log and move on
    // rather than leaving an unhandled promise rejection at startup.
    .catch((error) => {
      console.warn("Failed to wake up API.", error);
    });
}

// Telemetry is not needed to show anything, so loading and starting it must
// not compete with getting the app on screen.
function setUpAppInsightsWhenIdle() {
  const setUp = () => {
    import("./util/appInsights").then((appInsights) => {
      appInsights.setUpAppInsights();
    });
  };

  if (window.requestIdleCallback) {
    window.requestIdleCallback(setUp, { timeout: 10_000 });
  } else {
    // Safari does not know requestIdleCallback.
    window.setTimeout(setUp, 3_000);
  }
}

function getInitialJsx() {
  return (
    <React.StrictMode>
      <ThemeAndStylesProvider>
        <Bootstrapper />
      </ThemeAndStylesProvider>
    </React.StrictMode>
  );
}
