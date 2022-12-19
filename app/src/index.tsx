import React from "react";
import { Bootstrapper } from "./Bootstrapper";
import { createRoot } from "react-dom/client";
import { ThemeAndStylesProvider } from "./theming/ThemeAndStylesProvider";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeAndStylesProvider>
      <Bootstrapper />
    </ThemeAndStylesProvider>
  </React.StrictMode>
);
