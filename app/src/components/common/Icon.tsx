import React from "react";
import { styled } from "@mui/material";
import { IconStyle } from "./IconStyle";

export const Icon: React.FC<{
  children: React.ReactNode;
  style: IconStyle;
}> = ({ children, style }) => {
  const Host = style === IconStyle.Small ? SmallHost : LargeHost;

  return <Host className="ngrvd-icon">{children}</Host>;
};

const LargeHost = styled("span")`
  svg {
    border-radius: 100%;
    color: ${(p) => p.theme.palette.primary.main};
    background-color: ${(p) => p.theme.palette.background.default} !important;
    border: 2px solid ${(p) => p.theme.palette.primary.main};
    margin-top: 9px;
    padding: 2px;
    height: 0.8em;
    width: 0.8em;
  }
`;

const SmallHost = styled("span")`
  svg {
    border-radius: 100%;
    color: ${(p) => p.theme.palette.primary.main};
    border: 1px solid ${(p) => p.theme.palette.primary.main};
    padding: ${(p) => p.theme.spacing(0.5)};
    width: 0.6em;
    height: 0.6em;
  }
`;
