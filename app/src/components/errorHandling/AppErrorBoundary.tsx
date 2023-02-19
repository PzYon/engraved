import * as React from "react";
import { useAppContext } from "../../AppContext";
import { AppErrorBoundaryClass } from "./AppErrorBoundaryClass";

export const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const appContext = useAppContext();

  return (
    <AppErrorBoundaryClass setError={appContext.setAppAlert}>
      {children}
    </AppErrorBoundaryClass>
  );
};
