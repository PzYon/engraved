import { styled } from "@mui/material";
import { Link } from "@tanstack/react-router";

export const StyledLink = styled(Link)`
  color: ${(p) => p.theme.palette.common.white} !important;
  text-decoration: underline;
`;
