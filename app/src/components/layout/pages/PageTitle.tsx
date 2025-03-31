import { styled } from "@mui/material";
import React from "react";
import { MuiTheme } from "../../../theming/engravedTheme";

export const PageTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <>
    <IconContainer>{icon}</IconContainer>
    <span>{title}</span>
  </>
);

const IconContainer = styled("span")`
  margin-right: ${(p: MuiTheme) => p.theme.spacing(2)};
`;
