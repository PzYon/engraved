import { IMeasurement } from "../../../serverApi/IMeasurement";
import { ChartProps } from "react-chartjs-2/dist/types";
import { ChartType } from "chart.js";
import { transform } from "./transformation/transform";
import { IMetric } from "../../../serverApi/IMetric";
import { GroupBy } from "./consolidation/GroupBy";
import { TimeUnit } from "chart.js/types/adapters";

export const createChart = (
  type: ChartType,
  groupBy: GroupBy,
  measurements: IMeasurement[],
  metric: IMetric
): ChartProps => {
  const data = transform(measurements, metric, groupBy);

  return {
    type: type,
    options: {
      normalized: true,
      scales: {
        x: {
          type: "time",
          time: { minUnit: getTimeUnit(groupBy) },
        },
      },
    },
    data: {
      datasets: [
        {
          label: metric.name,
          normalized: true,
          data: data as never,
          backgroundColor: "deeppink",
          tension: 0.3,
        },
      ],
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
