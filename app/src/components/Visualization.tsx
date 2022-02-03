import { IMeasurement } from "../serverApi/IMeasurement";
import React from "react";
import {
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

ChartJS.register(
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
  const data = measurements.map((latency) => ({
    timestamp: latency.dateTime,
    value: latency.value,
  }));

  return (
    <Chart
      type="line"
      options={{
        parsing: {
          xAxisKey: "timestamp",
          yAxisKey: "value",
        },
        scales: {
          x: { type: "time" },
        },
      }}
      data={{
        datasets: [
          {
            type: "line",
            data: data,
            label: "My First Dataset",
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1,
          },
        ],
      }}
    />
  );
};
