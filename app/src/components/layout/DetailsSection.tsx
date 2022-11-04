import React from "react";
import { Paper, styled, Typography } from "@mui/material";

export const DetailsSection: React.FC<{
  children: React.ReactNode;
  title?: string;
  overflowXScroll?: boolean;
}> = ({ title, children, overflowXScroll }) => {
  return (
    <Host style={{ overflowX: overflowXScroll ? "auto" : "hidden" }}>
      {title ? (
        <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
          {title}
        </Typography>
      ) : null}
      {children}
    </Host>
  );
};

const Host = styled(Paper)`
  margin: ${(p) => p.theme.spacing(2)} 0;
  padding: ${(p) => p.theme.spacing(2)};
`;
