import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppHeader } from "./components/layout/AppHeader";
import { AppContent } from "./components/layout/AppContent";
import { AppRoutes } from "./components/layout/AppRoutes";
import { AppContextProvider } from "./AppContext";
import { AppErrorBoundary } from "./components/errorHandling/AppErrorBoundary";
import { AppAlertBar } from "./components/errorHandling/AppAlertBar";
import { DialogContextProvider } from "./components/layout/dialogs/DialogContext";
import { IUser } from "./serverApi/IUser";
import { PageContextProvider } from "./components/layout/pages/PageContext";
import { ReactQueryProviderWrapper } from "./serverApi/reactQuery/ReactQueryProviderWrapper";

export const App: React.FC<{ user: IUser }> = ({ user }) => (
  <AppContextProvider user={user}>
    <ReactQueryProviderWrapper>
      <BrowserRouter>
        <DialogContextProvider>
          <PageContextProvider>
            <AppHeader />
            <AppAlertBar />
            <AppErrorBoundary>
              <AppContent>
                <AppRoutes />
              </AppContent>
            </AppErrorBoundary>
          </PageContextProvider>
        </DialogContextProvider>
      </BrowserRouter>
    </ReactQueryProviderWrapper>
  </AppContextProvider>
);
