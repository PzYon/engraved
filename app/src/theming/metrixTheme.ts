import { createTheme } from "@mui/material/styles";

const textColor = "#444444";

export const metrixTheme = createTheme({
  palette: {
    primary: {
      main: "#2a7b9b",
    },
    secondary: {
      main: "#2a7b9b",
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
    fontFamily: "Karla",
    htmlFontSize: 14,
    body2: {
      color: textColor,
    },
    h1: {
      fontSize: "3rem",
    },
    h2: {
      fontSize: "2rem",
      color: textColor,
    },
    h5: {
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
