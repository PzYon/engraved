import React from "react";
import { Paper, styled, Typography } from "@mui/material";
import { DeviceWidth, useDeviceWidth } from "../../common/useDeviceWidth";
import { AppErrorBoundary } from "../../errorHandling/AppErrorBoundary";

export const PageSection: React.FC<{
  children: React.ReactNode;
  icon?: React.ReactNode;
  title?: string;
  style?: React.CSSProperties;
  overflowXScroll?: boolean;
  testId?: string;
}> = ({ title, icon, children, style, overflowXScroll, testId }) => {
  const deviceWidth = useDeviceWidth();

  return (
    <AppErrorBoundary>
      <Host
        className="page-section"
        sx={{
          ...(style ?? {}),
          overflowX: overflowXScroll ? "auto" : undefined,
          p: deviceWidth === DeviceWidth.Small ? 2 : 3,
        }}
        data-testid={testId}
      >
        {title ? (
          <Typography
            sx={{
              flexShrink: 0,
              fontWeight: "bold",
              pb: 1,
              mb: 2,
              display: "flex",
              color: "primary.main",
              borderBottom: "1px solid",
              borderColor: "background.default",
            }}
          >
            {icon ? <span style={{ paddingRight: "8px" }}>{icon}</span> : null}
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

  // any potential (recursive) children need no spacing

  .page-section {
    margin: 0;
    padding: 0;
  }
`;
