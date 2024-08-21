// https://stackoverflow.com/questions/72128718/test-suite-failed-to-run-import-meta-env-vite
import { IGaugeEntry } from "../../../serverApi/IGaugeEntry";
import { calculateThresholds } from "./calculateThresholds";
import { JournalType } from "../../../serverApi/JournalType";
import { ThresholdScope } from "./ThresholdScope";
import { NewThresholdValue } from "./IThresholdValues";

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
      [{ value: 10 } as IGaugeEntry, { value: 20 } as IGaugeEntry],
    );

    expect(Object.keys(values).length).toBe(1);
    expect(values["-"]["-"].currentValue).toBe(30);
    expect(values["-"]["-"].thresholdValue).toBe(20);
    expect(values["-"]["-"].remainingValue).toBe(-10);
    expect(values["-"]["-"].isReached).toBe(true);
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
    const colorValues: { [p: string]: NewThresholdValue } = values["color"];
    expect(Object.keys(colorValues).length).toBe(2);

    expect(colorValues["green"].thresholdValue).toBe(10);
    expect(colorValues["green"].currentValue).toBe(4);
    expect(colorValues["green"].isReached).toBe(false);
    expect(colorValues["green"].remainingValue).toBe(6);

    expect(colorValues["yellow"].thresholdValue).toBe(5);
    expect(colorValues["yellow"].currentValue).toBe(8);
    expect(colorValues["yellow"].isReached).toBe(true);
    expect(colorValues["yellow"].remainingValue).toBe(-3);
  });

  /*
  it("should calculate overall and consider scope", () => {
    const values = calculateThresholds(
      JournalType.Gauge,
      { "-": { "-": { value: 20, scope: ThresholdScope.Day } } },
      [
        { value: 10, dateTime: subDays(new Date(), 1).toJSON() } as IGaugeEntry,
        { value: 20, dateTime: subDays(new Date(), 2).toJSON() } as IGaugeEntry,
      ],
    );

    expect(Object.keys(values).length).toBe(1);
    expect(values["-"]["-"].actualValue).toBe(40);
  });
   */
});
