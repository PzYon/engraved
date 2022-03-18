import * as React from "react";
import { ReactNode } from "react";
import { IAppAlert } from "./AppAlertBar";

export interface IAppErrorBoundaryClass {
  setError: (alert: IAppAlert) => void;
}

export class AppErrorBoundaryClass extends React.PureComponent<IAppErrorBoundaryClass> {
  public componentDidCatch(error: Error): void {
    debugger;
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
