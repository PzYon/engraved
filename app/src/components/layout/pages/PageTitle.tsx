import { styled } from "@mui/material";
import React from "react";

export const PageTitle: React.FC<{ icon: React.ReactNode; title: string }> = ({
  icon,
  title,
}) => (
  <>
    <IconContainer>{icon}</IconContainer>
    <TitleContainer>{title}</TitleContainer>
  </>
);

const IconContainer = styled("span")`
  margin-right: ${(p) => p.theme.spacing(2)};
`;

const TitleContainer = styled("span")`
  font-weight: 200;
`;
