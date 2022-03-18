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
    return (
      <>
        {this.state.error ? (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            ...
          </Alert>
        ) : null}
        {this.props.children}
      </>
    );
  }
}

//credits to https://github.com/bvaughn/react-error-boundary/blob/master/src/index.tsx
export function useErrorHandler(
  givenError?: unknown
): (error: unknown) => void {
  const [error, setError] = React.useState<unknown>(null);
  if (givenError != null) {
    throw givenError;
  }

  if (error != null) {
    throw error;
  }

  return setError;
}
