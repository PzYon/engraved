import { ThemeProvider } from "@mui/material";
import { GlobalStyles } from "@mui/styled-engine";
import React from "react";
import { engravedTheme } from "./engravedTheme";

export const ThemeAndStylesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <ThemeProvider theme={engravedTheme}>
    <GlobalStyles
      styles={{
        "::selection": {
          backgroundColor: engravedTheme.palette.primary.light + " !important",
          color: "white !important",
        },

        html: {
          background: engravedTheme.palette.background.default,
        },

        body: {
          margin: 0,
          overflowY: "scroll",
        },

        a: {
          color: engravedTheme.palette.primary.main + " !important;",
          textDecoration: "none",
        },
      }}
    />
    {children}
  </ThemeProvider>
);
