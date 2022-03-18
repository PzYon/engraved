import * as React from "react";
import { useAppContext } from "../../AppContext";
import { AppErrorBoundaryClass } from "./AppErrorBoundaryClass";

export const AppErrorBoundary: React.FC = ({ children }) => {
  const appContext = useAppContext();

  return (
    <AppErrorBoundaryClass setError={appContext.setAppAlert}>
      {children}
    </AppErrorBoundaryClass>
  );
};

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
