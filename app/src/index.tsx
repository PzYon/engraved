import React from "react";
import { Bootstrapper } from "./Bootstrapper";
import { createRoot } from "react-dom/client";
import { ThemeAndStylesProvider } from "./theming/ThemeAndStylesProvider";
import { ServerApi } from "./serverApi/ServerApi";

import("./util/appInsights").then((appInsights) => {
  appInsights.setUpAppInsights();
});

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

function getInitialJsx() {
  return (
    <React.StrictMode>
      <ThemeAndStylesProvider>
        <Bootstrapper />
      </ThemeAndStylesProvider>
    </React.StrictMode>
  );
}
