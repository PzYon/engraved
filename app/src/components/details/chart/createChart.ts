import { IMeasurement } from "../../../serverApi/IMeasurement";
import { ChartProps } from "react-chartjs-2/dist/types";
import { ChartDataset, ChartType } from "chart.js";
import { transform } from "./transformation/transform";
import { IMetric } from "../../../serverApi/IMetric";
import { GroupByTime } from "./consolidation/GroupByTime";
import { TimeUnit } from "chart.js/types/adapters";
import { lighten } from "@mui/material";

export const createChart = (
  measurements: IMeasurement[],
  metric: IMetric,
  type: ChartType,
  groupBy: GroupByTime,
  color: string,
  attributeKey: string
): ChartProps => {
  const dataSets: ChartDataset[] = createDataSets(
    metric,
    measurements,
    groupBy,
    color,
    attributeKey
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
      datasets: dataSets,
    },
  };
};

function createDataSets(
  metric: IMetric,
  allMeasurements: IMeasurement[],
  groupByTime: GroupByTime,
  color: string,
  attributeKey: string
) {
  const allValueKeys = Object.keys(
    metric.attributes[attributeKey]?.values || {}
  );
  allValueKeys.push(null); // null is for measurements without a flag

  const dataSets: ChartDataset[] = allValueKeys
    .map((valueKey) =>
      filterMeasurementsByAttributeValue(
        allMeasurements,
        attributeKey,
        valueKey
      )
    )
    .filter((measurements) => measurements.length)
    .map((measurements) =>
      measurementsToDataSet(measurements, metric, groupByTime, attributeKey)
    );

  const diffPerDataSet = 0.8 / Math.max(dataSets.length - 1, 1);

  return dataSets.map((dataSet, i) => {
    return {
      ...dataSet,
      backgroundColor: lighten(color, i * diffPerDataSet),
    };
  });
}

function filterMeasurementsByAttributeValue(
  measurements: IMeasurement[],
  attributeKey: string,
  valueKey: string
): IMeasurement[] {
  return measurements.filter((m) =>
    valueKey
      ? m.metricAttributeValues[attributeKey]?.indexOf(valueKey) > -1
      : true
  );
}

function measurementsToDataSet(
  measurements: IMeasurement[],
  metric: IMetric,
  groupByTime: GroupByTime,
  attributeKey: string
) {
  const data = transform(measurements, metric, groupByTime);

  // TODO: we use indexer here to get (only) the first item. what if there's more?
  const valueKey = measurements[0]?.metricAttributeValues?.[attributeKey]?.[0];

  return {
    label: valueKey
      ? metric.attributes[attributeKey].values[valueKey]
      : metric.name,
    normalized: true,
    data: data as never,
    tension: 0.3,
  };
}

function getTimeUnit(groupByTime: GroupByTime): TimeUnit {
  switch (groupByTime) {
    case GroupByTime.None:
      return null;
    case GroupByTime.Day:
      return "day";
    case GroupByTime.Month:
      return "month";
  }
}
