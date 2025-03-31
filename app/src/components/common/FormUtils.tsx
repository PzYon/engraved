import { styled } from "@mui/material";
import { MuiTheme } from "../../theming/engravedTheme";

export const FormElementContainer = styled("div")`
  margin-top: ${(p: MuiTheme) => p.theme.spacing(2)};
  width: 100%;
`;
