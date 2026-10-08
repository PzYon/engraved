import React from "react";
import { styled } from "@mui/material";
import { iconSizesInPx, IconStyle } from "./IconStyle";

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
    box-sizing: border-box;
    border-radius: 100%;
    color: ${(p) => p.theme.palette.primary.main};
  }
`;

const LargeHost = styled(BaseHost)`
  svg {
    background-color: ${(p) => p.theme.palette.background.default} !important;
    border: 2px solid ${(p) => p.theme.palette.primary.main};
    margin-top: 9px;
    padding: 2px;
    height: ${iconSizesInPx[IconStyle.Large]}px;
    width: ${iconSizesInPx[IconStyle.Large]}px;
  }
`;

const SmallHost = styled(BaseHost)`
  svg {
    border: 1px solid ${(p) => p.theme.palette.primary.main};
    padding: ${(p) => p.theme.spacing(0.5)};
    width: ${iconSizesInPx[IconStyle.Small]}px;
    height: ${iconSizesInPx[IconStyle.Small]}px;
  }
`;
