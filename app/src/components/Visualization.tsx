import { IMeasurement } from "../serverApi/IMeasurement";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const Visualization: React.FC<{ measurements: IMeasurement[] }> = ({
  measurements,
}) => {
  const fo = CategoryScale;
  return (
    <Chart
      type="line"
      data={{
        labels: ["Mo", "Di"],
        datasets: [
          {
            data: [123, 23],
            label: "My First Dataset",
            fill: false,
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      }}
    />
  );
};
