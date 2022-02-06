import React from "react";
import { Paper, styled } from "@mui/material";

export const Section: React.FC = ({ children }) => {
  return <Host elevation={3}>{children}</Host>;
};

const Host = styled(Paper)`
  max-width: 1200px;
  box-sizing: border-box;
  margin: 30px auto;
  padding: 20px;
`;
