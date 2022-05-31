import { GroupByTime } from "../consolidation/GroupByTime";
import { IMeasurement } from "../../../../serverApi/IMeasurement";
import { IMetric } from "../../../../serverApi/IMetric";
import { MetricType } from "../../../../serverApi/MetricType";
import { createDataSets } from "./createDataSets";

describe("createDataSets", () => {
  it("should group by nothing", () => {
    const metric: IMetric = createMetric();
    const measurements: IMeasurement[] = createMeasurements();

    const dataSets = createDataSets(measurements, metric, GroupByTime.None, "");

    expect(dataSets.length).toBe(1);
    expect(dataSets[0].data.length).toBe(4);
  });

  it("should group by attribute key", () => {
    const metric: IMetric = createMetric();
    const measurements: IMeasurement[] = createMeasurements();

    const dataSets = createDataSets(
      measurements,
      metric,
      GroupByTime.None,
      "colors"
    );

    expect(dataSets.length).toBe(3);

    const rotData = dataSets.find((d) => d.label == "Rot").data;
    expect(rotData.length).toBe(1);

    const gruenData = dataSets.find((d) => d.label == "Gruen").data;
    expect(gruenData.length).toBe(2);

    const restData = dataSets.find((d) => d.label == "Name").data;
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
  // we use exactly the same date for everything, in order to be
  // sure that time-grouping doesn't interfere here.
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
