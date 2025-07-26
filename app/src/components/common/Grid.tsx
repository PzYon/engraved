import React from "react";
import { Grid, SxProps } from "@mui/material";

export const GridItem: React.FC<{
  children?: React.ReactNode;
  sx?: SxProps;
}> = ({ children, sx }) => {
  return (
    <Grid size={{ xs: 2, sm: 4, md: 4 }} sx={sx}>
      {children}
    </Grid>
  );
};

export const GridContainer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <Grid
      container
      sx={{ mt: 2 }}
      spacing={2}
      columns={{ xs: 4, sm: 8, md: 12 }}
    >
      {children}
    </Grid>
  );
};
