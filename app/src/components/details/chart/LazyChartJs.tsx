import React, { useEffect, useMemo } from "react";
import {
  ArcElement,
  BarController,
  DoughnutController,
  PieController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartTypeRegistry,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  TimeScale,
  Title,
  Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { createChart } from "./createChart";
import { IVisualizationProps } from "./IVisualizationProps";
import { useTheme } from "@mui/material/styles";
import { useMetricDetailsContext } from "../MetricDetailsContext";

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
  Tooltip
);

const LazyChartJs: React.FC<IVisualizationProps> = ({
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

  const { toggleAttributeValue } = useMetricDetailsContext();

  const chart = useMemo(
    () =>
      createChart(
        measurements,
        metric,
        groupByTime,
        groupByAttribute,
        toggleAttributeValue,
        chartType as keyof ChartTypeRegistry,
        palette.primary.main
      ),
    [measurements, groupByTime, groupByAttribute, chartType]
  );

  return <Chart key={chartType} {...chart} />;
};

export default LazyChartJs;
