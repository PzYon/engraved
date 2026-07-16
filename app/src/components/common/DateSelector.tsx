import React from "react";
import { LazyLoadSuspender } from "./LazyLoadSuspender";
import { ISimpleDateSelectorProps } from "./ISimpleDateSelectorProps";

const LazySimpleDateSelector = React.lazy(
  () => import("./LazySimpleDateSelector"),
);

export const SimpleDateSelector: React.FC<IDateSelectorProps> = (props) => {
  return (
    <LazyLoadSuspender>
      <LazySimpleDateSelector {...props}></LazySimpleDateSelector>
    </LazyLoadSuspender>
  );
};

export interface IDateSelectorProps extends ISimpleDateSelectorProps {
  showTime?: boolean;
  showClear?: boolean;
}

const LazyDateSelector = React.lazy(() => import("./LazyDateSelector"));

export const DateSelector: React.FC<IDateSelectorProps> = (props) => {
  return (
    <LazyLoadSuspender>
      <LazyDateSelector {...props}></LazyDateSelector>
    </LazyLoadSuspender>
  );
};
