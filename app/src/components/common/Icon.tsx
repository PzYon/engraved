import React from "react";
import { styled } from "@mui/material";

export enum IconStyle {
  PageTitle,
  Overview,
}

export const Icon: React.FC<{
  children: React.ReactNode;
  style: IconStyle;
}> = ({ children, style }) => {
  const Host = style === IconStyle.Overview ? OverviewHost : PageTitleHost;

  return <Host className="ngrvd-icon">{children}</Host>;
};

const PageTitleHost = styled("span")`
  svg {
    border-radius: 100%;
    color: ${(p) => p.theme.palette.primary.main};
    background-color: ${(p) => p.theme.palette.background.default} !important;
    border: 2px solid ${(p) => p.theme.palette.primary.main};
    margin-top: 9px;
    margin-right: ${(p) => p.theme.spacing(2)};
    padding: 2px;
    height: 0.8em;
    width: 0.8em;
  }
`;

const OverviewHost = styled("span")`
  svg {
    border-radius: 100%;
    border: 1px solid ${(p) => p.theme.palette.primary.main};
    color: ${(p) => p.theme.palette.primary.main};
    padding: ${(p) => p.theme.spacing(0.5)};
    width: 0.6em;
    height: 0.6em;
  }
`;
