import React from "react";
import { Paper, styled, Typography } from "@mui/material";

export const DetailsSection: React.FC<{
  children: React.ReactNode;
  title?: string;
  overflowXScroll?: boolean;
}> = ({ title, children, overflowXScroll }) => {
  return (
    <Host
      className={"details-section"}
      style={{ overflowX: overflowXScroll ? "auto" : "hidden" }}
    >
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

  // hack: make sure first heading does not have top margin.
  // hack because it does not matter, if the h1 is the first
  // child or somewhere else.
  h1:first-of-type {
    margin-top: 0;
  }

  .details-section {
    margin: 0;
    padding: 0;
  }
`;
