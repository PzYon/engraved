import { Alert, AlertTitle } from "@mui/material";
import * as React from "react";
import { ReactNode } from "react";

interface IAppErrorBoundaryState {
  error?: Error;
}

export class AppErrorBoundary extends React.PureComponent<
  unknown,
  IAppErrorBoundaryState
> {
  public readonly state: IAppErrorBoundaryState = {
    error: undefined,
  };

  public componentDidCatch(error: Error): void {
    this.setState({ error: error });
  }

  public render(): ReactNode {
    if (this.state.error) {
      return (
        <>
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            ...
          </Alert>{" "}
          {this.props.children}
        </>
      );
    }

    return this.props.children;
  }
}
