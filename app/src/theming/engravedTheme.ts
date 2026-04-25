import { createTheme } from "@mui/material";

export const paperBorderRadius = "10px";

export const actionBorderWidth = "4px";

const textColor = "#444444";
const primaryColor = "#2a7b9b";

export const engravedTheme = createTheme({
  palette: {
    primary: {
      main: primaryColor,
    },
    secondary: {
      main: primaryColor,
    },
    text: {
      primary: textColor,
    },
    background: {
      default: "#d4e3eb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Inter",
    body2: {
      color: textColor,
    },
    h1: {
      fontSize: "3rem",
      fontFamily: "Pacifico",
    },
    h2: {
      fontSize: "1.8rem",
      color: textColor,
    },
    h5: {
      fontSize: "1.8rem",
      fontWeight: 200,
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
        sx: { borderRadius: paperBorderRadius },
      },
    },
    MuiTooltip: {
      defaultProps: {
        enterDelay: 1000,
      },
      styleOverrides: {
        tooltip: {
          backgroundColor: primaryColor,
          color: "#ffffff",
        },
      },
    },
  },
});
