import { IMeasurement } from "../../../serverApi/IMeasurement";
import { ChartProps } from "react-chartjs-2/dist/types";
import { ChartDataset, ChartType } from "chart.js";
import { transform } from "./transformation/transform";
import { IMetric } from "../../../serverApi/IMetric";
import { GroupBy } from "./consolidation/GroupBy";
import { TimeUnit } from "chart.js/types/adapters";
import { lighten } from "@mui/material";

export const createChart = (
  measurements: IMeasurement[],
  metric: IMetric,
  type: ChartType,
  groupBy: GroupBy,
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
          ticks: {
            stepSize: 1,
          },
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
  allMeasurements: IMeasurement[],
  groupBy: GroupBy,
  color: string
) {
  const allFlags = Object.keys(metric.flags || {});
  allFlags.push(null); // null is for measurements without a flag

  const dataSets: ChartDataset[] = allFlags
    .map((flag) => filterMeasurementsByFlag(allMeasurements, flag))
    .filter((measurements) => measurements.length)
    .map((measurements) =>
      measurementsToDataSet(measurements, metric, groupBy)
    );

  const diffPerDataSet = 0.8 / Math.max(dataSets.length - 1, 1);

  return dataSets.map((dataSet, i) => {
    return {
      ...dataSet,
      backgroundColor: lighten(color, i * diffPerDataSet),
    };
  });
}

function filterMeasurementsByFlag(
  measurements: IMeasurement[],
  flag: string
): IMeasurement[] {
  return measurements.filter((m) =>
    flag ? m.metricFlagKey === flag : !m.metricFlagKey
  );
}

function measurementsToDataSet(
  measurements: IMeasurement[],
  metric: IMetric,
  groupBy: GroupBy
) {
  const data = transform(measurements, metric, groupBy);

  const metricFlagKey = measurements[0].metricFlagKey;

  return {
    label: metricFlagKey ? metric.flags[metricFlagKey] : metric.name,
    normalized: true,
    data: data as never,
    tension: 0.3,
  };
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
