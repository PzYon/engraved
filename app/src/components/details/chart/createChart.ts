import { IEntry } from "../../../serverApi/IEntry";
import { IJournal } from "../../../serverApi/IJournal";
import { GroupByTime } from "./consolidation/GroupByTime";
import { createDataSets } from "./dataSets/createDataSets";
import { IDataSet } from "./dataSets/IDataSet";
import { ChartProps } from "react-chartjs-2";
import { ActiveElement, ChartEvent, ChartType, Element, TimeUnit } from "chart.js";
import { PartialEventContext } from "chartjs-plugin-annotation";
import { lighten } from "@mui/material";
import {
  getCoefficient,
  getColorShades,
  getNumberOfDays,
} from "../../../util/utils";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { ITransformedEntry } from "./transformation/ITransformedEntry";
import { JournalType } from "../../../serverApi/JournalType";
import { format, startOfDay } from "date-fns";
import { IJournalType } from "../../../journalTypes/IJournalType";
import { IChartUiProps } from "./IChartProps";
import { getUiSettings } from "../../../util/journalUtils";
import { AggregationMode } from "../edit/IJournalUiSettings";
import { IDateConditions } from "../JournalContext";

export const createChart = (
  entries: IEntry[],
  journal: IJournal,
  groupByTime: GroupByTime,
  attributeKey: string,
  toggleAttributeValue: (
    attributeKey: string,
    attributeValueKey: string,
  ) => void,
  type: ChartType,
  color: string,
  chartUiProps: IChartUiProps,
  aggregationMode: AggregationMode,
  dateConditions: IDateConditions,
): ChartProps => {
  switch (type) {
    case "bar":
      return createBarChart(
        entries,
        color,
        journal,
        toggleAttributeValue,
        groupByTime,
        attributeKey,
        chartUiProps,
        aggregationMode,
        dateConditions,
      );

    case "line":
      return createLineChart(
        entries,
        color,
        journal,
        toggleAttributeValue,
        groupByTime,
        attributeKey,
        chartUiProps,
        aggregationMode,
        dateConditions,
      );

    case "doughnut":
      return createPieChart(
        entries,
        color,
        journal,
        groupByTime,
        attributeKey,
        chartUiProps,
      );

    default:
      throw new Error(`Chart type '${type}' is not supported.`);
  }
};

function createLineChart(
  entries: IEntry[],
  color: string,
  journal: IJournal,
  toggleAttributeValue: (
    attributeKey: string,
    attributeValueKey: string,
  ) => void,
  groupByTime: GroupByTime,
  attributeKey: string,
  chartUiProps: IChartUiProps,
  aggregationMode: AggregationMode,
  dateConditions: IDateConditions,
): ChartProps {
  // hack: for the moment we create a bar chart and then adjust
  // the relevant properties
  const chart = createBarChart(
    entries,
    color,
    journal,
    toggleAttributeValue,
    groupByTime,
    attributeKey,
    chartUiProps,
    aggregationMode,
    dateConditions,
  );

  chart.type = "line";
  if (chart.options) chart.options.borderColor = color;

  return chart;
}

function createPieChart(
  entries: IEntry[],
  color: string,
  journal: IJournal,
  groupByTime: GroupByTime,
  attributeKey: string,
  chartUiProps: IChartUiProps,
): ChartProps {
  const dataSets: IDataSet[] = createDataSets(
    entries,
    journal,
    groupByTime,
    attributeKey,
    chartUiProps,
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
                    previousValue + currentValue,
                ),
            0,
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

function getTooltipValue(type: IJournalType, entry: ITransformedEntry): string {
  const segments: string[] = [];

  const value = entry.y;
  segments.push(type.formatTotalValue?.(value) ?? value.toFixed(3));

  if (entry.entries.length === 1 && entry.entries[0].notes) {
    segments.push(entry.entries[0].notes);
  }

  return segments.join(", ");
}

function createBarChart(
  entries: IEntry[],
  color: string,
  journal: IJournal,
  toggleAttributeValue: (
    attributeKey: string,
    attributeValueKey: string,
  ) => void,
  groupByTime: GroupByTime,
  attributeKey: string,
  chartUiProps: IChartUiProps,
  aggregationMode: AggregationMode,
  dateConditions: IDateConditions,
): ChartProps {
  const dataSets: IDataSet[] = createDataSets(
    entries,
    journal,
    groupByTime,
    attributeKey,
    chartUiProps,
  );

  const decoratedDataSets = dataSets.map((dataSet, i) => {
    return {
      ...dataSet,
      normalized: true,
      tension: 0.3,
      backgroundColor: lighten(color, getCoefficient(i, dataSets.length)),
    };
  });

  const journalType = JournalTypeFactory.create(journal.type);

  const uiSettings = getUiSettings(journal);

  return {
    type: "bar",
    options: {
      onClick: (_: ChartEvent, elements: ActiveElement[]) => {
        if (!attributeKey || !elements.length) {
          return;
        }

        const raw = (
          elements[0].element as Element & { $context: { raw: ITransformedEntry } }
        ).$context.raw;

        const attributeValues = raw.entries.map(
          (m) => m.journalAttributeValues?.[attributeKey],
        );

        toggleAttributeValue(attributeKey, attributeValues[0]?.[0] ?? "");
      },
      normalized: true,
      scales: {
        x: {
          stacked: true,
          type: "time",
          time: { minUnit: getTimeUnit(groupByTime) },
          max: startOfDay(dateConditions?.to ?? new Date()).getTime(),
        },
        y: {
          min: uiSettings?.fixedScales?.min,
          max: uiSettings?.fixedScales?.max,
          stacked: true,
          ticks: {
            callback: (value) =>
              journalType.formatTotalValue?.(value as number) ?? value,
            precision: journalType.type === JournalType.Counter ? 0 : 5,
          },
          title: {
            display: true,
            text: uiSettings.yAxisUnit || journalType.getYAxisLabel(journal),
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
                new Date((tooltipItems[0].raw as ITransformedEntry).x),
                getTooltipTitleFormat(groupByTime) ?? "dd.LL.yy",
              );
            },
            label: (tooltipItem): string | string[] | void => {
              return getTooltipValue(
                journalType,
                tooltipItem.raw as ITransformedEntry,
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
              value: (ctx) => average(ctx, aggregationMode),
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

function getTimeUnit(groupByTime: GroupByTime): TimeUnit | undefined {
  switch (groupByTime) {
    case GroupByTime.None:
      return undefined;
    case GroupByTime.Day:
      return "day";
    case GroupByTime.Month:
      return "month";
  }
}

function average(
  ctx: PartialEventContext,
  aggregationMode: AggregationMode,
): number {
  const values = ctx.chart.data.datasets[0]?.data as unknown as
    | ITransformedEntry[]
    | undefined;

  if (!values) {
    // chart.js's annotation `value` callback requires a number (undefined is
    // not allowed by its types), so we fall back to 0 when there are no values.
    return 0;
  }

  const averageDivisor =
    aggregationMode === "average-by-occurrence"
      ? values.flatMap((v) => v.entries).length
      : getNumberOfDays(values.map((v) => v.x));

  return (
    values.reduce((total: number, currentEntry: ITransformedEntry) => {
      return currentEntry.y + total;
    }, 0) / averageDivisor
  );
}
