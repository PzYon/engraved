// https://stackoverflow.com/questions/72128718/test-suite-failed-to-run-import-meta-env-vite
import { IGaugeEntry } from "../../../serverApi/IGaugeEntry";
import { calculateThresholds } from "./calculateThresholds";
import { JournalType } from "../../../serverApi/JournalType";
import { ThresholdScope } from "./ThresholdScope";
import { IThresholdValue } from "../../../serverApi/IThresholdValues";

jest.mock("../../../env/envSettings.ts", () => ({
  isDev: true,
}));

describe("calculateThresholds", () => {
  it("should do nothing with empty thresholds", () => {
    const values = calculateThresholds(JournalType.Gauge, {}, []);
    expect(Object.keys(values).length).toBe(0);
  });

  it("should do nothing with null thresholds", () => {
    const values = calculateThresholds(JournalType.Gauge, null, []);
    expect(Object.keys(values).length).toBe(0);
  });

  it("should calculate overall", () => {
    const values = calculateThresholds(
      JournalType.Gauge,
      { "-": { "-": { value: 20, scope: ThresholdScope.Overall } } },
      [
        { value: 1 } as IGaugeEntry,
        { value: 9 } as IGaugeEntry,
        { value: 10 } as IGaugeEntry,
        { value: 20 } as IGaugeEntry,
      ],
    );

    expect(Object.keys(values).length).toBe(1);
    expect(values["-"]["-"].actualValue).toBe(40);
  });

  it("should calculate per attribute", () => {
    const values = calculateThresholds(
      JournalType.Gauge,
      {
        color: {
          yellow: { value: 5, scope: ThresholdScope.Overall },
          green: { value: 10, scope: ThresholdScope.Overall },
        },
      },
      [
        {
          value: 3,
          journalAttributeValues: { color: ["yellow"] },
          dateTime: new Date().toJSON(),
        } as IGaugeEntry,
        {
          value: 4,
          journalAttributeValues: { color: ["green"] },
          dateTime: new Date().toJSON(),
        } as IGaugeEntry,
        {
          value: 5,
          journalAttributeValues: { color: ["yellow"] },
          dateTime: new Date().toJSON(),
        } as IGaugeEntry,
        {
          value: 6,
          dateTime: new Date().toJSON(),
        } as IGaugeEntry,
      ],
    );

    expect(Object.keys(values).length).toBe(1);
    const value: { [p: string]: IThresholdValue } = values["color"];
    expect(Object.keys(value).length).toBe(2);
    expect(value["green"].actualValue).toBe(4);
    expect(value["yellow"].actualValue).toBe(8);
  });
});
