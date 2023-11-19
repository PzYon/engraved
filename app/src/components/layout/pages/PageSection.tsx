import React from "react";
import { Paper, styled, Typography } from "@mui/material";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { AppErrorBoundary } from "../../errorHandling/AppErrorBoundary";

export const PageSection: React.FC<{
  children: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  overflowXScroll?: boolean;
  testId?: string;
}> = ({ title, children, style, overflowXScroll, testId }) => {
  const deviceWidth = useDeviceWidth();

  return (
    <AppErrorBoundary>
      <Host
        className={"details-section"}
        sx={{
          ...(style ?? {}),
          overflowX: overflowXScroll ? "auto" : "hidden",
          p: deviceWidth === DeviceWidth.Small ? 2 : 3,
        }}
        data-testid={testId}
      >
        {title ? (
          <Typography sx={{ flexShrink: 0, fontWeight: "bold" }}>
            {title}
          </Typography>
        ) : null}
        {children}
      </Host>
    </AppErrorBoundary>
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
