import React from "react";
import { LazyLoadSuspender } from "./LazyLoadSuspender";
import { IDateSelectorProps } from "./IDateSelectorProps";

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

const LazyDateSelector = React.lazy(() => import("./LazyDateSelector"));

export const DateSelector: React.FC<IDateSelectorProps> = (props) => {
  return (
    <LazyLoadSuspender>
      <LazyDateSelector {...props}></LazyDateSelector>
    </LazyLoadSuspender>
  );
};
