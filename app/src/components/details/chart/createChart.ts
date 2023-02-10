import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IMetric } from "../../../serverApi/IMetric";
import { GroupByTime } from "./consolidation/GroupByTime";
import { createDataSets } from "./dataSets/createDataSets";
import { IDataSet } from "./dataSets/IDataSet";
import { ChartProps } from "react-chartjs-2";
import { ActiveElement, ChartEvent, ChartType, TimeUnit } from "chart.js";
import { lighten } from "@mui/material";
import { getCoefficient, getColorShades } from "../../../util/utils";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { ITransformedMeasurement } from "./transformation/ITransformedMeasurement";
import { MetricType } from "../../../serverApi/MetricType";
import { format } from "date-fns";
import { IMetricType } from "../../../metricTypes/IMetricType";

export const createChart = (
  measurements: IMeasurement[],
  metric: IMetric,
  groupByTime: GroupByTime,
  attributeKey: string,
  toggleAttributeValue: (
    attributeKey: string,
    attributeValueKey: string
  ) => void,
  type: ChartType,
  color: string
): ChartProps => {
  switch (type) {
    case "bar":
      return createBarChart(
        measurements,
        color,
        metric,
        toggleAttributeValue,
        groupByTime,
        attributeKey
      );

    case "doughnut":
      return createPieChart(
        measurements,
        color,
        metric,
        groupByTime,
        attributeKey
      );

    default:
      throw new Error(`Chart type '${type}' is not supported.`);
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
    options: {
      aspectRatio: 3,
    },
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

function getTooltipTitleFormat(groupByTime: GroupByTime) {
  switch (groupByTime) {
    case GroupByTime.Day:
      return "EEE dd.LL.yy";
    case GroupByTime.Month:
      return "MMMM yy";
    default:
  }
}

function getTooltipValue(type: IMetricType, value: number): string {
  return (type.formatTotalValue?.(value) ?? value).toString();
}

function createBarChart(
  measurements: IMeasurement[],
  color: string,
  metric: IMetric,
  toggleAttributeValue: (
    attributeKey: string,
    attributeValueKey: string
  ) => void,
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
      onClick: (_: ChartEvent, elements: ActiveElement[]) => {
        if (!attributeKey) {
          return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = (elements[0].element as unknown as any).$context
          .raw as ITransformedMeasurement;

        const attributeValues = raw.measurements.map(
          (m) => m.metricAttributeValues?.[attributeKey]
        );

        toggleAttributeValue(attributeKey, attributeValues[0][0]);
      },
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
                ? metricType.formatTotalValue?.(value as number) ?? value
                : value;
            },
            precision: metricType.type === MetricType.Counter ? 0 : undefined,
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
          callbacks: {
            title: (tooltipItems) => {
              return format(
                new Date((tooltipItems[0].raw as ITransformedMeasurement).x),
                getTooltipTitleFormat(groupByTime)
              );
            },
            label: (tooltipItem): string | string[] | void => {
              return getTooltipValue(
                metricType,
                (tooltipItem.raw as ITransformedMeasurement).y
              );
            },
          },
        },
        legend: {
          position: "top",
        },
        annotation: {
          annotations: {
            y: {
              type: "line",
              borderColor: color,
              borderDash: [12, 6],
              borderDashOffset: 0,
              borderWidth: 1,
              scaleID: "y",
              value: (ctx) => average(ctx),
            },
          },
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

/* eslint-disable  @typescript-eslint/no-explicit-any */
function average(ctx: any) {
  const values = ctx.chart.data.datasets[0]?.data;

  if (!values) {
    return null;
  }

  return (
    values.reduce(
      (total: number, currentMeasurement: ITransformedMeasurement) => {
        return currentMeasurement.y + total;
      },
      0
    ) / values.length
  );
}
