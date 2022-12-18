import React from "react";
import { UnauthenticatedApp } from "./serverApi/authentication/UnauthenticatedApp";
import { createRoot } from "react-dom/client";
import { ThemeAndStylesProvider } from "./theming/ThemeAndStylesProvider";

const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeAndStylesProvider>
      <UnauthenticatedApp />
    </ThemeAndStylesProvider>
  </React.StrictMode>
);
