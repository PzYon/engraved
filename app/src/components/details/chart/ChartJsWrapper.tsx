import React from "react";
import { IChartProps } from "./IChartProps";
import { LazyLoadSuspender } from "../../common/lazyLoadComponent";

const ChartJs = React.lazy(() => import("./LazyChartJs"));

export const ChartJsWrapper: React.FC<IChartProps> = (props: IChartProps) => {
  return (
    <LazyLoadSuspender>
      <ChartJs {...props} />
    </LazyLoadSuspender>
  );
};
