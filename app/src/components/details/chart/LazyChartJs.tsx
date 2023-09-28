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
import { useTheme } from "@mui/material/styles";
import { useMetricContext } from "../MetricDetailsContext";

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
  measurements,
  metric,
  groupByTime,
  groupByAttribute,
  chartType,
}) => {
  const { typography, palette } = useTheme();

  useEffect(() => {
    ChartJS.defaults.font.family = typography.fontFamily;
    ChartJS.defaults.font.size = typography.htmlFontSize;
  }, []);

  const { toggleAttributeValue } = useMetricContext();

  const chart = useMemo(
    () =>
      measurements
        ? createChart(
            measurements,
            metric,
            groupByTime,
            groupByAttribute,
            toggleAttributeValue,
            chartType as keyof ChartTypeRegistry,
            palette.primary.main,
          )
        : null,
    [measurements, groupByTime, groupByAttribute, chartType],
  );

  return chart ? <Chart key={chartType} {...chart} /> : null;
};

export default LazyChartJs;
