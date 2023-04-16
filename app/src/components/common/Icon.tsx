import React from "react";
import { styled } from "@mui/material";

export enum IconStyle {
  Overview,
  PageTitle,
  Activity,
}

export const Icon: React.FC<{
  children: React.ReactNode;
  style: IconStyle;
}> = ({ children, style }) => {
  const Host =
    style === IconStyle.Overview
      ? OverviewHost
      : style === IconStyle.Activity
      ? ActivityHost
      : PageTitleHost;

  return (
    <Host
      style={{ display: "flex", flexDirection: "row" }}
      className="ngrvd-icon"
    >
      {children}
    </Host>
  );
};

const PageTitleHost = styled("span")`
  svg {
    border-radius: 100%;
    height: 0.8em;
    width: 0.8em;
    color: ${(p) => p.theme.palette.primary.main};
    background-color: ${(p) => p.theme.palette.background.default} !important;
    border: 2px solid ${(p) => p.theme.palette.primary.main};
    margin-top: 5px;
    margin-right: 10px;
    padding: 2px;
  }
`;

const OverviewHost = styled("span")`
  svg {
    border-radius: 100%;
    border: 2px solid ${(p) => p.theme.palette.primary.main};
    padding: ${(p) => p.theme.spacing(1)};
    color: ${(p) => p.theme.palette.primary.main};
    width: 0.8em;
    height: 0.8em;
  }
`;

const ActivityHost = styled("span")`
  svg {
    border-radius: 100%;
    border: 1px solid ${(p) => p.theme.palette.primary.main};
    padding: ${(p) => p.theme.spacing(0.5)};
    color: ${(p) => p.theme.palette.primary.main};
    width: 0.6em;
    height: 0.6em;
  }
`;
