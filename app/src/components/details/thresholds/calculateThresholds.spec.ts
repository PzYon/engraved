import { IGaugeEntry } from "../../../serverApi/IGaugeEntry";
import { calculateThresholds } from "./calculateThresholds";
import { JournalType } from "../../../serverApi/JournalType";
import { ThresholdScope } from "./ThresholdScope";
import { ThresholdValue } from "./IThresholdValues";
import { subDays } from "date-fns";

// https://stackoverflow.com/questions/72128718/test-suite-failed-to-run-import-meta-env-vite
jest.mock("../../../env/envSettings.ts", () => ({
  isDev: true,
}));

// missing tests:
// - when from/to is null
// - different scopes

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

    const overallValues = values["-"]["-"];
    expect(overallValues.currentValue).toBe(30);
    expect(overallValues.thresholdValue).toBe(20);
    expect(overallValues.remainingValueForDuration).toBe(-10);
    expect(overallValues.isReached).toBe(true);
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
    const colorValues: { [p: string]: ThresholdValue } = values["color"];
    expect(Object.keys(colorValues).length).toBe(2);

    expect(colorValues["green"].thresholdValue).toBe(10);
    expect(colorValues["green"].currentValue).toBe(4);
    expect(colorValues["green"].isReached).toBe(false);
    expect(colorValues["green"].remainingValueForDuration).toBe(6);

    expect(colorValues["yellow"].thresholdValue).toBe(5);
    expect(colorValues["yellow"].currentValue).toBe(8);
    expect(colorValues["yellow"].isReached).toBe(true);
    expect(colorValues["yellow"].remainingValueForDuration).toBe(-3);
  });

  it("should calculate overall and consider scope", () => {
    const fromDate = subDays(new Date(), 5);

    const values = calculateThresholds(
      JournalType.Gauge,
      { "-": { "-": { value: 20, scope: ThresholdScope.Day } } },
      [
        { value: 10, dateTime: fromDate.toJSON() } as IGaugeEntry,
        { value: 20, dateTime: subDays(new Date(), 2).toJSON() } as IGaugeEntry,
      ],
      { from: fromDate, to: new Date() },
    );

    expect(Object.keys(values).length).toBe(1);
    expect(values["-"]["-"].currentValue).toBe(30);
    expect(values["-"]["-"].isReached).toBe(false);
  });
});
