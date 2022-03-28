import React from "react";
import {
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
  groupBy,
}) => {
  const theme = useTheme();

  const chart = createChart(
    "bar",
    groupBy,
    measurements,
    metric,
    theme.palette.primary.main
  );

  return <Chart {...chart} />;
};

export default LazyChartJs;
