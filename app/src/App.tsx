import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppHeader } from "./components/layout/AppHeader";
import { AppContent } from "./components/layout/AppContent";
import { AppRoutes } from "./components/layout/AppRoutes";
import { AppContextProvider } from "./AppContext";
import { AppError } from "./components/AppError";
import { AppErrorBoundary } from "./AppErrorBoundary";

export const App: React.FC = () => {
  return (
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
};
