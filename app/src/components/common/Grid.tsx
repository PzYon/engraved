import React from "react";
import { Grid2 } from "@mui/material";

export const GridItem: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Grid2 item xs={2} sm={4} md={4}>
      {children}
    </Grid2>
  );
};

export const GridContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Grid2
      container
      sx={{ mt: 2 }}
      spacing={2}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {children}
    </Grid2>
  );
};
