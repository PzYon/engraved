import { IMeasurement } from "../../../serverApi/IMeasurement";
import { ChartProps } from "react-chartjs-2/dist/types";
import { ChartDataset, ChartType } from "chart.js";
import { transform } from "./transformation/transform";
import { IMetric } from "../../../serverApi/IMetric";
import { GroupBy } from "./consolidation/GroupBy";
import { TimeUnit } from "chart.js/types/adapters";

export const createChart = (
  type: ChartType,
  groupBy: GroupBy,
  measurements: IMeasurement[],
  metric: IMetric,
  color: string
): ChartProps => {
  const dataSets: ChartDataset[] = createDataSets(
    metric,
    measurements,
    groupBy,
    color
  );

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
        y: {
          stacked: true,
        },
      },
    },
    data: {
      datasets: dataSets,
    },
  };
};

function createDataSets(
  metric: IMetric,
  measurements: IMeasurement[],
  groupBy: GroupBy,
  color: string
) {
  const allFlags = Object.keys(metric.flags || {});
  allFlags.push(null); // null is for measurements without a flag

  const dataSets: ChartDataset[] = [];

  for (const flag of allFlags) {
    const measurementsForFlag = measurements.filter((m) =>
      flag ? m.metricFlagKey === flag : !m.metricFlagKey
    );

    if (!measurementsForFlag.length) {
      continue;
    }

    const data = transform(measurementsForFlag, metric, groupBy);

    dataSets.push({
      label: flag || metric.name,
      normalized: true,
      data: data as never,
      backgroundColor: flag == "irf" ? color : "deeppink",
      tension: 0.3,
      // stack: label,
    });
  }

  return dataSets;
}

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
