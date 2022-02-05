import { IMeasurement } from "../../serverApi/IMeasurement";
import { ChartProps } from "react-chartjs-2/dist/types";
import { ChartType } from "chart.js";

export const createChart = (
  type: ChartType,
  measurements: IMeasurement[]
): ChartProps => {
  const data = measurements.map((measurement) => ({
    timestamp: measurement.dateTime,
    value: measurement.value,
  }));

  return {
    type: type,
    options: {
      parsing: {
        xAxisKey: "timestamp",
        yAxisKey: "value",
      },
      scales: {
        x: { type: "time" },
      },
    },
    data: {
      datasets: [
        {
          type: type,
          data: data as never,
          label: "My First Dataset",
          borderColor: "rgb(75, 192, 192)",
          tension: 0.1,
        },
      ],
    },
  };
};
