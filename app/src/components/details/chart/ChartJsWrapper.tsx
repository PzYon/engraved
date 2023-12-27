import React from "react";
import { IChartProps } from "./IChartProps";

const ChartJs = React.lazy(() => import("./LazyChartJs"));

export const ChartJsWrapper: React.FC<IChartProps> = (props: IChartProps) => {
  return <ChartJs {...props} />;
};