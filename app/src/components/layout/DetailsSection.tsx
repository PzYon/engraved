import React from "react";
import { Paper, Typography } from "@mui/material";
import styled from "styled-components";

export const DetailsSection: React.FC<{
  title?: string;
  subTitle?: string;
}> = ({ title, children }) => {
  return (
    <Host elevation={0}>
      {title ? <Typography sx={{ flexShrink: 0 }}>{title}</Typography> : null}
      {children}
    </Host>
  );
};

const Host = styled(Paper)`
  margin: 20px 0;
  padding: 20px;
`;
