import React from "react";
import { Paper, styled, Typography } from "@mui/material";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";

export const PageSection: React.FC<{
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  overflowXScroll?: boolean;
}> = ({ title, children, style, overflowXScroll }) => {
  const deviceWidth = useDeviceWidth();

  return (
    <Host
      className={"details-section"}
      style={{
        ...(style ?? {}),
        padding: deviceWidth === DeviceWidth.Small ? "16px" : "24px",
        overflowX: overflowXScroll ? "auto" : "hidden",
      }}
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
  margin: ${(p) => p.theme.spacing(3)} 0;

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
