import { IMeasurement } from "../../serverApi/IMeasurement";
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

export const Visualization: React.FC<{ measurements: IMeasurement[] }> = ({
  measurements,
}) => {
  return <Chart {...createChart("bar", measurements)} />;
};
