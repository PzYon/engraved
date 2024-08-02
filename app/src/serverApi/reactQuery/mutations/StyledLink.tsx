import { styled } from "@mui/material";
import { Link } from "react-router-dom";

export const StyledLink = styled(Link)`
  color: ${(p) => p.theme.palette.common.white} !important;
  text-decoration: underline;
`;
