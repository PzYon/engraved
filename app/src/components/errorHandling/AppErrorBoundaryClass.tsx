import * as React from "react";
import { ReactNode } from "react";
import { IAppAlert } from "./AppAlertBar";

export interface IAppErrorBoundaryClassProps {
  setError: (alert: IAppAlert) => void;
  children: React.ReactNode;
}

export class AppErrorBoundaryClass extends React.PureComponent<IAppErrorBoundaryClassProps> {
  public componentDidCatch(error: Error): void {
    this.props.setError({
      message: error.message,
      title: "React error",
      type: "error",
    });
  }

  public render(): ReactNode {
    return this.props.children;
  }
}
