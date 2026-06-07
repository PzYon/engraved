import { styled } from "@mui/material";
import { Link } from "@tanstack/react-router";

const StyledLinkBase = styled(Link)`
  color: ${(p) => p.theme.palette.common.white} !important;
  text-decoration: underline;
`;

export const StyledLink = StyledLinkBase as typeof Link;
