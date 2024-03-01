import React from "react";
import { LazyLoadSuspender } from "./lazyLoadComponent";

export interface IDateSelectorProps {
  setDate: (date: Date) => void;
  date: Date;
  label?: string;
  showTime?: boolean;
  showClear?: boolean;
  hasFocus?: boolean;
}

const LazyDateSelector = React.lazy(() => import("./LazyDateSelector"));

export const DateSelector: React.FC<IDateSelectorProps> = (props) => {
  return (
    <LazyLoadSuspender>
      <LazyDateSelector {...props}></LazyDateSelector>
    </LazyLoadSuspender>
  );
};
