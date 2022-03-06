import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppHeader } from "./components/layout/AppHeader";
import { AppContent } from "./components/layout/AppContent";
import { AppRoutes } from "./components/layout/AppRoutes";
import { AppContextProvider } from "./AppContext";

export const App: React.FC = () => {
  return (
    <AppContextProvider>
      <BrowserRouter>
        <AppHeader />
        <AppContent>
          <AppRoutes />
        </AppContent>
      </BrowserRouter>
    </AppContextProvider>
  );
};
