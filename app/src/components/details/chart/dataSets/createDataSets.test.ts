// https://stackoverflow.com/questions/72128718/test-suite-failed-to-run-import-meta-env-vite
jest.mock("../../../../env/envSettings.ts", () => ({
  isDev: true,
}));

import { GroupByTime } from "../consolidation/GroupByTime";
import { IEntry } from "../../../../serverApi/IEntry";
import { IJournal } from "../../../../serverApi/IJournal";
import { JournalType } from "../../../../serverApi/JournalType";
import { createDataSets } from "./createDataSets";

describe("createDataSets", () => {
  it("should group by nothing", () => {
    const journal: IJournal = createJournal();
    const entries: IEntry[] = createEntries();

    const dataSets = createDataSets(entries, journal, GroupByTime.None, "");

    expect(dataSets.length).toBe(1);
    expect(dataSets[0].data.length).toBe(4);
  });

  it("should group by attribute key", () => {
    const journal: IJournal = createJournal();
    const entries: IEntry[] = createEntries();

    const dataSets = createDataSets(
      entries,
      journal,
      GroupByTime.None,
      "colors",
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

function createJournal() {
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
    type: JournalType.Counter,
    name: "Name",
  };
}

function createEntries() {
  // we use exactly the same date for everything, in order to be
  // sure that time-grouping doesn't interfere here.
  const dateTime = new Date().toString();

  return [
    {
      journalAttributeValues: { colors: ["red"] },
      value: 1,
      dateTime: dateTime,
    },
    {
      journalAttributeValues: { colors: ["green"] },
      value: 1,
      dateTime: dateTime,
    },
    {
      journalAttributeValues: { colors: ["green"] },
      value: 1,
      dateTime: dateTime,
    },
    {
      journalAttributeValues: {},
      value: 1,
      dateTime: dateTime,
    },
  ];
}
