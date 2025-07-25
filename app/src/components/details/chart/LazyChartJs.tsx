import React, { useEffect, useMemo } from "react";
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartTypeRegistry,
  DoughnutController,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import annotationPlugin from "chartjs-plugin-annotation";
import { createChart } from "./createChart";
import { IChartProps } from "./IChartProps";
import { useTheme } from "@mui/material";
import { useJournalContext } from "../JournalContext";

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  DoughnutController,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PieController,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
  annotationPlugin,
);

const LazyChartJs: React.FC<IChartProps> = ({
  entries,
  journal,
  groupByTime,
  groupByAttribute,
  chartType,
  chartUiProps,
  onEntriesCalculated,
  aggregationMode,
  dateConditions,
}) => {
  const { typography, palette } = useTheme();

  useEffect(() => {
    ChartJS.defaults.font.family = typography.fontFamily;
    ChartJS.defaults.font.size = typography.htmlFontSize;
  }, [typography.fontFamily, typography.htmlFontSize]);

  const { toggleAttributeValue } = useJournalContext();

  const chart = useMemo(
    () =>
      entries
        ? createChart(
            entries,
            journal,
            groupByTime,
            groupByAttribute,
            toggleAttributeValue,
            chartType as keyof ChartTypeRegistry,
            palette.primary.main,
            chartUiProps,
            aggregationMode,
            dateConditions,
          )
        : null,
    [
      entries,
      journal,
      groupByTime,
      groupByAttribute,
      toggleAttributeValue,
      chartType,
      palette.primary.main,
      chartUiProps,
      aggregationMode,
      dateConditions,
    ],
  );

  useEffect(() => {
    onEntriesCalculated?.(chart?.data?.datasets?.[0]?.data?.length ?? 0);
  }, [chart, onEntriesCalculated]);

  return chart ? <Chart key={chartType} {...chart} /> : null;
};

export default LazyChartJs;
