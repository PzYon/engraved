import { IMeasurement } from "../../../serverApi/IMeasurement";
import { ChartProps } from "react-chartjs-2/dist/types";
import { ChartDataset, ChartType } from "chart.js";
import { transform } from "./transformation/transform";
import { IMetric } from "../../../serverApi/IMetric";
import { GroupBy } from "./consolidation/GroupBy";
import { TimeUnit } from "chart.js/types/adapters";
import { ITransformedMeasurement } from "./transformation/ITransformedMeasurement";

function createDataSet(
  data: ITransformedMeasurement[],
  label: string,
  backgroundColor: string
): ChartDataset {
  return {
    label: label,
    normalized: true,
    data: data as never,
    backgroundColor: backgroundColor,
    tension: 0.3,
    // stack: label,
  };
}

export const createChart = (
  type: ChartType,
  groupBy: GroupBy,
  measurements: IMeasurement[],
  metric: IMetric,
  color: string
): ChartProps => {
  const flags = Object.keys(metric.flags || {});
  const hasFlags = flags.length;

  const dataSets: ChartDataset[] = [];

  if (hasFlags) {
    for (const flag of flags) {
      const measurementsForFlag = measurements.filter(
        (m) => m.metricFlagKey == flag
      );

      const data = transform(measurementsForFlag, metric, groupBy);
      const dataSet = createDataSet(
        data,
        flag,
        flag == "irf" ? color : "deeppink"
      );
      dataSets.push(dataSet);
    }
  } else {
    const data = transform(measurements, metric, groupBy);
    const dataSet = createDataSet(data, metric.name, color);
    dataSets.push(dataSet);
  }

  return {
    type: type,
    options: {
      normalized: true,
      scales: {
        x: {
          stacked: true,
          type: "time",
          time: { minUnit: getTimeUnit(groupBy) },
        },
        // y: {
        //  stacked: true,
        // },
      },
    },
    data: {
      datasets: dataSets,
    },
  };
};

function getTimeUnit(groupBy: GroupBy): TimeUnit {
  switch (groupBy) {
    case GroupBy.None:
      return null;
    case GroupBy.Day:
      return "day";
    case GroupBy.Month:
      return "month";
  }
}
