import React, { Suspense } from "react";

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
    <Suspense fallback={<div />}>
      <LazyDateSelector {...props}></LazyDateSelector>
    </Suspense>
  );
};
