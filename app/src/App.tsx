import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppHeader } from "./components/layout/AppHeader";
import { AppContent } from "./components/layout/AppContent";
import { AppRoutes } from "./components/layout/AppRoutes";
import { AppContextProvider } from "./AppContext";
import { AppErrorBoundary } from "./components/errorHandling/AppErrorBoundary";
import { AppAlertBar } from "./components/errorHandling/AppAlertBar";
import { DialogContextProvider } from "./components/layout/dialogs/DialogContext";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GlobalStyles } from "@mui/styled-engine-sc";

const theme = createTheme({
  palette: {
    primary: {
      main: "#c70039",
    },
    text: {
      primary: "#444444",
    },
    background: {
      default: "#c70039",
      paper: "#c70039",
    },
  },
  typography: {
    fontFamily: "Rubik",
  },
});

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <GlobalStyles
      styles={{
        a: {
          color: theme.palette.primary.main + " !important;",
          textDecoration: "none",
        },

        html: {
          background: theme.palette.background.default,
        },
      }}
    />
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
