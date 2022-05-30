import { createChart } from "./createChart";
import { GroupByTime } from "./consolidation/GroupByTime";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IMetric } from "../../../serverApi/IMetric";
import { MetricType } from "../../../serverApi/MetricType";

describe("createChart", () => {
  it("should group by nothing", () => {
    const metric: IMetric = createMetric();
    const measurements: IMeasurement[] = createMeasurements();
    const type = "bar";

    const chart = createChart(
      measurements,
      metric,
      type,
      "#ffffff",
      GroupByTime.None,
      ""
    );

    expect(chart.data.datasets.length).toBe(1);
    expect(chart.data.datasets[0].data.length).toBe(4);
  });

  it("should group by attribute key", () => {
    const metric: IMetric = createMetric();
    const measurements: IMeasurement[] = createMeasurements();
    const type = "bar";

    const chart = createChart(
      measurements,
      metric,
      type,
      "#ffffff",
      GroupByTime.None,
      "colors"
    );

    expect(chart.data.datasets.length).toBe(3);

    const rotData = chart.data.datasets.find((d) => d.label == "Rot").data;
    expect(rotData.length).toBe(1);

    const gruenData = chart.data.datasets.find((d) => d.label == "Gruen").data;
    expect(gruenData.length).toBe(2);

    const restData = chart.data.datasets.find((d) => d.label == "Name").data;
    expect(restData.length).toBe(1);
  });
});

function createMetric() {
  return {
    attributes: {
      colors: {
        name: "Farben",
        values: {
          red: "Rot",
          green: "Gruen",
          yellow: "Gelb",
        },
      },
    },
    type: MetricType.Counter,
    name: "Name",
  };
}

function createMeasurements() {
  const dateTime = new Date().toString();

  return [
    {
      metricAttributeValues: { colors: ["red"] },
      value: 1,
      dateTime: dateTime,
    },
    {
      metricAttributeValues: { colors: ["green"] },
      value: 1,
      dateTime: dateTime,
    },
    {
      metricAttributeValues: { colors: ["green"] },
      value: 1,
      dateTime: dateTime,
    },
    {
      metricAttributeValues: {},
      value: 1,
      dateTime: dateTime,
    },
  ];
}
