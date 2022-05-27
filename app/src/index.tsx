import React from "react";
import { UnauthenticatedApp } from "./UnauthenticatedApp";
import { createRoot } from "react-dom/client";

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UnauthenticatedApp />
  </React.StrictMode>
);
