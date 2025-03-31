import { styled } from "@mui/material";
import { Link } from "react-router-dom";
import { MuiTheme } from "../../../theming/engravedTheme";

export const StyledLink = styled(Link)`
  color: ${(p: MuiTheme) => p.theme.palette.common.white} !important;
  text-decoration: underline;
`;
