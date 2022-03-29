import { GlobalStyles } from "@mui/styled-engine";
import React from "react";
import { metrixTheme } from "./metrixTheme";
import { ThemeProvider } from "@mui/material";

export const ThemeAndStylesProvider: React.FC = ({ children }) => (
  <ThemeProvider theme={metrixTheme}>
    <GlobalStyles
      styles={{
        html: {
          background: metrixTheme.palette.background.default,
        },

        body: {
          margin: 0,
          overflowY: "scroll",
        },

        a: {
          color: metrixTheme.palette.primary.main + " !important;",
          textDecoration: "none",
        },
      }}
    />
    {children}
  </ThemeProvider>
);
