import * as React from "react";
import { ReactNode } from "react";
import { IAppAlert } from "./AppAlertBar";

export interface IAppErrorBoundaryClassProps {
  setError: (alert: IAppAlert) => void;
  children: React.ReactNode;
}

export class AppErrorBoundaryClass extends React.PureComponent<IAppErrorBoundaryClassProps> {
  componentDidCatch(error: Error): void {
    import("./../../util/appInsights").then((appInsights) => {
      appInsights.logExceptionToAppInsights(error);
    });

    this.props.setError({
      message: error.message,
      title: "React error",
      type: "error",
    });
  }

  render(): ReactNode {
    return this.props.children;
  }
}
