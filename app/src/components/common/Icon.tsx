import React from "react";
import { styled } from "@mui/material";
import { MetricTypeIconStyle } from "./MetricTypeIcon";

export const Icon: React.FC<{
  children: React.ReactNode;
  style: MetricTypeIconStyle;
}> = ({ children, style }) => {
  const Host =
    style === MetricTypeIconStyle.Overview ? OverviewHost : PageTitleHost;

  return <Host>{children}</Host>;
};

const PageTitleHost = styled("div")`
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

const OverviewHost = styled("div")`
  svg {
    border-radius: 100%;
    border: 2px solid ${(p) => p.theme.palette.primary.main};
    padding: ${(p) => p.theme.spacing(1)};
    color: ${(p) => p.theme.palette.primary.main};
    width: 0.8em;
    height: 0.8em;
  }
`;
