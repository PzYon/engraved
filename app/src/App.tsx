import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppHeader } from "./components/layout/AppHeader";
import { AppContent } from "./components/layout/AppContent";
import { AppRoutes } from "./components/layout/AppRoutes";
import { AppContextProvider } from "./AppContext";
import { AppErrorBoundary } from "./components/errorHandling/AppErrorBoundary";
import { AppAlertBar } from "./components/errorHandling/AppAlertBar";
import { DialogContextProvider } from "./components/layout/dialogs/DialogContext";

export const App: React.FC = () => (
  <AppContextProvider>
    <DialogContextProvider>
      <BrowserRouter>
        <AppHeader />
        <AppAlertBar />
        <AppErrorBoundary>
          <AppContent>
            <AppRoutes />
          </AppContent>
        </AppErrorBoundary>
      </BrowserRouter>
    </DialogContextProvider>
  </AppContextProvider>
);
