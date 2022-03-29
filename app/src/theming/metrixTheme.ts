import { createTheme } from "@mui/material/styles";

export const metrixTheme = createTheme({
  palette: {
    primary: {
      main: "#2a7b9b",
    },
    secondary: {
      main: "#2a7b9b",
    },
    text: {
      primary: "#444444",
    },
    background: {
      default: "#d4e3eb",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "Karla",
    htmlFontSize: 14,
    h1: {
      fontSize: "3rem",
    },
    h2: {
      fontSize: "2rem",
    },
  },
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
    },
  },
});
