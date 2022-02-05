import React, { Suspense } from "react";
import { IVisualizationProps } from "./IVisualizationProps";

export const Visualization: React.FC<IVisualizationProps> = (
  props: IVisualizationProps
) => {
  const ChartJs = React.lazy(() => import("./LazyChartJs"));

  return (
    <Suspense fallback={<div />}>
      <ChartJs {...props} />
    </Suspense>
  );
};
