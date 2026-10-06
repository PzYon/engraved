import { IJournal } from "../serverApi/IJournal";
import { JournalType } from "../serverApi/JournalType";
import { hasValues, sortJournalsByName } from "./journalUtils";

describe("hasValues", () => {
  it("match (0 selected values)", () => {
    const actual = hasValues({ unit: ["hour"], foo: ["bar"] }, {});
    expect(actual).toBe(true);
  });

  it("non-match (1 selected value, 0 applied values)", () => {
    const actual = hasValues({}, { unit: ["hour"] });
    expect(actual).toBe(false);
  });

  it("match (1 selected value)", () => {
    const actual = hasValues({ unit: ["hour"] }, { unit: ["hour"] });
    expect(actual).toBe(true);
  });

  it("non-match (1 selected value)", () => {
    const actual = hasValues({ unit: ["hour"] }, { unit: ["minute"] });
    expect(actual).toBe(false);
  });

  it("match (2 selected values)", () => {
    const actual = hasValues(
      { unit: ["hour"], duration: ["long"] },
      { unit: ["hour"], duration: ["long"] },
    );
    expect(actual).toBe(true);
  });

  it("non-match (2 selected values)", () => {
    const actual = hasValues(
      { unit: ["hour"], duration: ["long"] },
      { unit: ["hour"], duration: ["short"] },
    );
    expect(actual).toBe(false);
  });
});

describe("sortJournalsByName", () => {
  function createJournals(...names: (string | undefined)[]): IJournal[] {
    return names.map((name) => ({ name, type: JournalType.Counter }));
  }

  function getNames(journals: IJournal[]) {
    return journals.map((j) => j.name);
  }

  it("should sort by name", () => {
    const sorted = sortJournalsByName(createJournals("c", "a", "b"));

    expect(getNames(sorted)).toEqual(["a", "b", "c"]);
  });

  it("should ignore casing", () => {
    const sorted = sortJournalsByName(createJournals("b", "C", "a", "D"));

    expect(getNames(sorted)).toEqual(["a", "b", "C", "D"]);
  });

  it("should put journals without a name first", () => {
    const sorted = sortJournalsByName(createJournals("b", undefined, "a"));

    expect(getNames(sorted)).toEqual([undefined, "a", "b"]);
  });

  it("should not change the order of the journals passed in", () => {
    const journals = createJournals("c", "a", "b");

    sortJournalsByName(journals);

    expect(getNames(journals)).toEqual(["c", "a", "b"]);
  });
});
