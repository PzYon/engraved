import React from "react";
import { Bootstrapper } from "./Bootstrapper";
import { createRoot } from "react-dom/client";
import { ThemeAndStylesProvider } from "./theming/ThemeAndStylesProvider";
import { ServerApi } from "./serverApi/ServerApi";

wakeUpApi();

createRoot(document.getElementById("root")).render(getInitialJsx());

function wakeUpApi() {
  const start = performance.now();
  ServerApi.wakeMeUp().then(() => {
    const end = performance.now();
    console.log(`API has woken up after ${Math.round(end - start)}ms`);
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
