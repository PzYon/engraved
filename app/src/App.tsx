import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppHeader } from "./components/layout/AppHeader";
import { AppContent } from "./components/layout/AppContent";
import { AppRoutes } from "./components/layout/AppRoutes";
import { AppContextProvider } from "./AppContext";
import { AppErrorBoundary } from "./components/errorHandling/AppErrorBoundary";
import { AppAlertBar } from "./components/errorHandling/AppAlertBar";
import { DialogContextProvider } from "./components/layout/dialogs/DialogContext";

import { ThemeProvider, createTheme } from "@mui/material/styles";

// todo:
// - text no 100% black

const theme = createTheme({
  palette: {
    primary: {
      main: "#39c6b8",
    },
  },
  typography: {
    fontFamily: "Rubik",
  },
});

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
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
  </ThemeProvider>
);
