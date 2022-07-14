import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IMetric } from "../../../serverApi/IMetric";
import { GroupByTime } from "./consolidation/GroupByTime";
import { createDataSets } from "./dataSets/createDataSets";
import { IDataSet } from "./dataSets/IDataSet";
import { ChartProps } from "react-chartjs-2";
import { ChartType, TimeUnit } from "chart.js";
import { lighten } from "@mui/material";
import { getCoefficient, getColorShades } from "../../common/utils";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";

export const createChart = (
  measurements: IMeasurement[],
  metric: IMetric,
  groupByTime: GroupByTime,
  attributeKey: string,
  type: ChartType,
  color: string
): ChartProps => {
  if (type === "bar") {
    return createBarChart(
      measurements,
      color,
      metric,
      groupByTime,
      attributeKey
    );
  }

  if (type === "pie") {
    return createPieChart(
      measurements,
      color,
      metric,
      groupByTime,
      attributeKey
    );
  }
};

function createPieChart(
  measurements: IMeasurement[],
  color: string,
  metric: IMetric,
  groupByTime: GroupByTime,
  attributeKey: string
): ChartProps {
  const dataSets: IDataSet[] = createDataSets(
    measurements,
    metric,
    groupByTime,
    attributeKey
  );

  return {
    type: "doughnut",
    data: {
      labels: dataSets.map((d) => d.label),
      datasets: [
        {
          backgroundColor: getColorShades(dataSets.length, color),
          data: dataSets.map(
            (sets) =>
              sets.data
                .map((set) => set.y)
                .reduce(
                  (previousValue: number, currentValue: number) =>
                    previousValue + currentValue
                ),
            0
          ),
        },
      ],
    },
  };
}

function createBarChart(
  measurements: IMeasurement[],
  color: string,
  metric: IMetric,
  groupByTime: GroupByTime,
  attributeKey: string
): ChartProps {
  const dataSets: IDataSet[] = createDataSets(
    measurements,
    metric,
    groupByTime,
    attributeKey
  );

  const decoratedDataSets = dataSets.map((dataSet, i) => {
    return {
      ...dataSet,
      normalized: true,
      tension: 0.3,
      backgroundColor: lighten(color, getCoefficient(i, dataSets.length)),
    };
  });

  const metricType = MetricTypeFactory.create(metric.type);

  return {
    type: "bar",
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
            callback: (value) => {
              return metricType.getValueLabel
                ? metricType.getValueLabel(value as number)
                : value;
            },
          },
          title: {
            display: true,
            text: metricType.getYAxisLabel(metric),
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
}

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
