import { IMeasurement } from "../../../serverApi/IMeasurement";
import { ChartProps } from "react-chartjs-2/dist/types";
import { ChartType } from "chart.js";

export const createChart = (
  type: ChartType,
  measurements: IMeasurement[]
): ChartProps => {
  const data = measurements.map((measurement) => ({
    x: new Date(measurement.dateTime),
    y: measurement.value,
  }));

  console.log(data.map((d) => d.x));

  return {
    type: type,
    options: {
      parsing: false,
      normalized: true,
      scales: {
        x: {
          type: "time",
          // time: { minUnit: "month", round: "minute" },
        },
      },
    },
    data: {
      datasets: [
        {
          label: "Label",
          normalized: true,
          data: data as never,
          backgroundColor: "deeppink",
          tension: 0.3,
        },
      ],
    },
  };
};
