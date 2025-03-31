import { CreateMUIStyled, createTheme } from "@mui/material";

export type MuiTheme = CreateMUIStyled<unknown>;

export const paperBorderRadius = "7px";

export const actionBorderWidth = "4px";

const textColor = "#444444";

export const engravedTheme = createTheme({
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
    body2: {
      color: textColor,
    },
    h1: {
      fontSize: "3rem",
      fontFamily: "Pacifico",
    },
    h2: {
      fontSize: "2rem",
      color: textColor,
    },
    h5: {
      fontSize: "2rem",
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
  },
});
