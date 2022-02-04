import React from "react";
import { Typography } from "@mui/material";

export const PageTitle: React.FC<{ title: string }> = ({ title }) => {
  return <Typography variant="h3">{title}</Typography>;
};
