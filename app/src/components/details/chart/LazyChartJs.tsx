import React, { useEffect } from "react";
import {
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
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

ChartJS.register(
  ArcElement,
  BarController,
  BarElement,
  CategoryScale,
  Legend,
  LinearScale,
  LineController,
  LineElement,
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
}) => {
  const { typography, palette } = useTheme();

  useEffect(() => {
    ChartJS.defaults.font.family = typography.fontFamily;
    ChartJS.defaults.font.size = typography.htmlFontSize;
  }, []);

  const chart = createChart(
    measurements,
    metric,
    groupByTime,
    groupByAttribute,
    "pie",
    palette.primary.main
  );

  return <Chart {...chart} />;
};

export default LazyChartJs;
