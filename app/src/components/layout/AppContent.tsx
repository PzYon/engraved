import {
  DeviceWidth,
  maxWidthInPx,
  useDeviceWidth,
} from "../common/useDeviceWidth";
import React from "react";
import { styled } from "@mui/material";

export const AppContent: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const deviceWidth = useDeviceWidth();

  return (
    <Host sx={deviceWidth !== DeviceWidth.Small ? { pl: 2, pr: 2 } : undefined}>
      {children}
    </Host>
  );
};

const Host = styled("div")`
  max-width: ${maxWidthInPx}px;
  box-sizing: border-box;
  margin: auto;
`;
