import React from "react";
import { styled } from "@mui/material";
import { IconStyle } from "./IconStyle";
import { MuiTheme } from "../../theming/engravedTheme";

export const Icon: React.FC<{
  children: React.ReactNode;
  style: IconStyle;
  isClickable?: boolean;
}> = ({ children, style, isClickable }) => {
  const Host = style === IconStyle.Small ? SmallHost : LargeHost;

  return (
    <Host className={`ngrvd-icon${isClickable ? " clickable" : ""}`}>
      {children}
    </Host>
  );
};

const BaseHost = styled("span")`
  &.clickable {
    cursor: pointer !important;
  }

  svg {
    border-radius: 100%;
    color: ${(p: MuiTheme) => p.theme.palette.primary.main};
  }
`;

const LargeHost = styled(BaseHost)`
  svg {
    background-color: ${(p: MuiTheme) =>
      p.theme.palette.background.default} !important;
    border: 2px solid ${(p: MuiTheme) => p.theme.palette.primary.main};
    margin-top: 9px;
    padding: 2px;
    height: 0.8em;
    width: 0.8em;
  }
`;

const SmallHost = styled(BaseHost)`
  svg {
    border: 1px solid ${(p: MuiTheme) => p.theme.palette.primary.main};
    padding: ${(p: MuiTheme) => p.theme.spacing(0.5)};
    width: 0.6em;
    height: 0.6em;
  }
`;
