import { SwitchAccessShortcutOutlined } from "@mui/icons-material";
import { Dialog, styled, Typography } from "@mui/material";
import React, { PropsWithChildren, ReactNode, Suspense, useState } from "react";

export const LazyLoadSuspender: React.FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <LazyLoadErrorBoundaryClass>
      <Suspense fallback={<div />}>{children}</Suspense>
    </LazyLoadErrorBoundaryClass>
  );
};

class LazyLoadErrorBoundaryClass extends React.Component<
  PropsWithChildren,
  { hasError: boolean }
> {
  state = {
    hasError: false,
  };

  componentDidCatch(error: Error): void {
    if (
      error.message?.indexOf("Failed to fetch dynamically imported module") > -1
    ) {
      this.setState({ hasError: true });
    }
  }

  render(): ReactNode {
    return this.state.hasError ? <ErrorOnLazyLoad /> : this.props.children;
  }
}

const ErrorOnLazyLoad: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Host onClick={() => location.reload()}>
        <SwitchAccessShortcutOutlined
          sx={{ color: "primary.main" }}
          fontSize={"large"}
        />
        <Typography sx={{ pt: 2, color: "primary.main" }}>
          Update available, click to reload.
        </Typography>
      </Host>
    </Dialog>
  );
};

const Host = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${(p) => p.theme.spacing(3)};
  cursor: pointer;
`;
