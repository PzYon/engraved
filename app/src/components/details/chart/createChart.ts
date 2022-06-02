import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IMetric } from "../../../serverApi/IMetric";
import { GroupByTime } from "./consolidation/GroupByTime";
import { createDataSets } from "./dataSets/createDataSets";
import { IDataSet } from "./dataSets/IDataSet";
import { ChartProps } from "react-chartjs-2";
import { ChartType, TimeUnit } from "chart.js";
import { lighten } from "@mui/material";

export const createChart = (
  measurements: IMeasurement[],
  metric: IMetric,
  groupByTime: GroupByTime,
  attributeKey: string,
  type: ChartType,
  color: string
): ChartProps => {
  const dataSets: IDataSet[] = createDataSets(
    measurements,
    metric,
    groupByTime,
    attributeKey
  );

  const diffFactorPerDataSet = 0.8 / Math.max(dataSets.length - 1, 1);

  const decoratedDataSets = dataSets.map((dataSet, i) => {
    return {
      ...dataSet,
      normalized: true,
      tension: 0.3,
      backgroundColor: lighten(color, i * diffFactorPerDataSet),
    };
  });

  return {
    type: type,
    options: {
      normalized: true,
      scales: {
        x: {
          stacked: true,
          type: "time",
          time: { minUnit: getTimeUnit(groupByTime) },
        },
        y: {
          stacked: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
      plugins: {
        tooltip: {
          backgroundColor: color,
          cornerRadius: 4,
        },
        legend: {
          position: "top",
        },
      },
    },
    data: {
      datasets: decoratedDataSets as never,
    },
  };
};

function getTimeUnit(groupByTime: GroupByTime): TimeUnit {
  switch (groupByTime) {
    case GroupByTime.None:
      return undefined;
    case GroupByTime.Day:
      return "day";
    case GroupByTime.Month:
      return "month";
  }
}
