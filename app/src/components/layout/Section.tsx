import React from "react";
import { Paper, styled, Typography } from "@mui/material";

export const Section: React.FC<{ title?: string }> = ({ children, title }) => {
  return (
    <Host elevation={3}>
      {title ? <Title variant="h4">{title}</Title> : null}
      {children}
    </Host>
  );
};

const Host = styled(Paper)({
  margin: "30px auto",
  padding: "20px",
});

const Title = styled(Typography)({
  fontSize: "inherit !important",
  marginBottom: "20px !important",
});
