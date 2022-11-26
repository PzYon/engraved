import React from "react";
import { Grid } from "@mui/material";

export const GridItem: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Grid item xs={2} sm={4} md={4}>
      {children}
    </Grid>
  );
};

export const GridContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
      {children}
    </Grid>
  );
};
