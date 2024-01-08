import { styled } from "@mui/material";
import React from "react";
import { AppContent } from "./AppContent";

export const AppFooter: React.FC = () => {
  return (
    <Host>
      <AppContent scope="header">Footy</AppContent>
    </Host>
  );
};

const Host = styled("div")`
  background-color: ${(p) => p.theme.palette.primary.main};
  color: ${(p) => p.theme.palette.common.white};
`;
