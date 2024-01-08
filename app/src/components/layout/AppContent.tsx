import { Container } from "@mui/material";
import React from "react";
import { DeviceWidth, useDeviceWidth } from "../common/useDeviceWidth";

export const AppContent: React.FC<{
  children: React.ReactNode;
  scope?: "header" | "body";
}> = ({ children, scope }) => {
  const deviceWidth = useDeviceWidth();
  const sx =
    deviceWidth === DeviceWidth.Small && scope === "body"
      ? { pl: 0, pr: 0 }
      : {};

  return (
    <Container maxWidth="lg" sx={{ ...sx, flexGrow: 1 }}>
      {children}
    </Container>
  );
};
