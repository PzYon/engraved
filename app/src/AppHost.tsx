import React from "react";
import { AppHeader } from "./components/layout/AppHeader";
import { AppAlertBar } from "./components/errorHandling/AppAlertBar";
import { AppContent } from "./components/layout/AppContent";
import { AppErrorBoundary } from "./components/errorHandling/AppErrorBoundary";
import { AppRoutes } from "./components/layout/AppRoutes";
import { AppFooter } from "./components/layout/AppFooter";
import { styled } from "@mui/material";

export const AppHost: React.FC = () => {
  return (
    <Host>
      <AppHeader />
      <AppAlertBar />
      <AppContent scope="body">
        <AppErrorBoundary>
          <AppRoutes />
        </AppErrorBoundary>
      </AppContent>
      <AppFooter />
    </Host>
  );
};

const Host = styled("div")`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;
