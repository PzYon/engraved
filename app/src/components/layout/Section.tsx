import React from "react";
import { Paper, styled, Typography } from "@mui/material";

export const Section: React.FC<{ title?: string }> = ({ children, title }) => {
  return (
    <Host>
      {title ? <Title variant="h4">{title}</Title> : null}
      {children}
    </Host>
  );
};

const Host = styled(Paper)`
  margin: ${(p) => p.theme.spacing(2)} auto;
  padding: ${(p) => p.theme.spacing(2)};
`;

const Title = styled(Typography)`
  font-size: inherit !important;
  margin-bottom: ${(p) => p.theme.spacing(2)} !important;
`;
