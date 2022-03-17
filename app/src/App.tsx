import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppHeader } from "./components/layout/AppHeader";
import { AppContent } from "./components/layout/AppContent";
import { AppRoutes } from "./components/layout/AppRoutes";
import { AppContextProvider } from "./AppContext";
import { AppErrorBoundary } from "./AppErrorBoundary";

export const App: React.FC = () => (
  <AppContextProvider>
    <AppErrorBoundary>
      <BrowserRouter>
        <AppHeader />
        <AppContent>
          <AppRoutes />
        </AppContent>
      </BrowserRouter>
    </AppErrorBoundary>
  </AppContextProvider>
);
