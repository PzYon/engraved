import { IEntry } from "../../../serverApi/IEntry";
import { IJournal } from "../../../serverApi/IJournal";
import { GroupByTime } from "./consolidation/GroupByTime";
import { createDataSets } from "./dataSets/createDataSets";
import { IDataSet } from "./dataSets/IDataSet";
import { ChartProps } from "react-chartjs-2";
import { ActiveElement, ChartEvent, ChartType, TimeUnit } from "chart.js";
import { lighten } from "@mui/material";
import { getCoefficient, getColorShades } from "../../../util/utils";
import { JournalTypeFactory } from "../../../journalTypes/JournalTypeFactory";
import { ITransformedEntry } from "./transformation/ITransformedEntry";
import { JournalType } from "../../../serverApi/JournalType";
import { format } from "date-fns";
import { IJournalType } from "../../../journalTypes/IJournalType";
import { IChartUiProps } from "./IChartProps";
import { getUiSettings } from "../../../util/journalUtils";

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
  );

  chart.type = "line";
  chart.options.borderColor = color;

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

function getTooltipValue(type: IJournalType, value: number): string {
  return type.formatTotalValue?.(value) ?? value.toFixed(3);
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = (elements[0].element as unknown as any).$context
          .raw as ITransformedEntry;

        const attributeValues = raw.entries.map(
          (m) => m.journalAttributeValues?.[attributeKey],
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
          min:
            uiSettings?.dynamicScales === true
              ? Math.round(
                  Math.min(
                    ...entries
                      .map((x) => journalType.getValue(x))
                      .filter((x) => x !== 0),
                  ) * 0.985,
                )
              : undefined,
          max:
            uiSettings?.dynamicScales === true
              ? Math.round(
                  Math.max(
                    ...entries
                      .map((x) => journalType.getValue(x))
                      .filter((x) => x !== 0),
                  ) * 1.015,
                )
              : undefined,
          stacked: true,
          ticks: {
            callback: (value) => {
              return journalType.getValueLabel
                ? journalType.formatTotalValue?.(value as number) ?? value
                : value;
            },
            precision: journalType.type === JournalType.Counter ? 0 : undefined,
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
                getTooltipTitleFormat(groupByTime),
              );
            },
            label: (tooltipItem): string | string[] | void => {
              return getTooltipValue(
                journalType,
                (tooltipItem.raw as ITransformedEntry).y,
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
    values.reduce((total: number, currentEntry: ITransformedEntry) => {
      return currentEntry.y + total;
    }, 0) / values.length
  );
}
