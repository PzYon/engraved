import React from "react";
import { LazyLoadSuspender } from "./LazyLoadSuspender";

export interface ISimpleDateSelectorProps {
  setDate: (date: Date) => void;
  date: Date;
  label?: string;
  hasFocus?: boolean;
}

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
