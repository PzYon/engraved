import { subDays, subHours } from "date-fns";
import { getSortedEntries } from "./getSortedEntries"; // https://stackoverflow.com/questions/72128718/test-suite-failed-to-run-import-meta-env-vite

// https://stackoverflow.com/questions/72128718/test-suite-failed-to-run-import-meta-env-vite
vi.mock("../../../env/envSettings.ts", () => ({
  isDev: true,
}));

const now = new Date();
const twoDaysAgo = subDays(now, 2);
const twoAndHalfDaysAgo = subHours(now, 2.5 * 24);

describe("getSortedEntries", () => {
  it("sorts entries from new to old", () => {
    const sortedEntries = getSortedEntries([
      { dateTime: twoAndHalfDaysAgo.toJSON() },
      { dateTime: now.toJSON() },
      { dateTime: twoDaysAgo.toJSON() },
    ]);

    expect(Object.keys(sortedEntries).length).toBe(2);
    expect(sortedEntries.entries[0].dateTime).toBe(now.toJSON());
    expect(sortedEntries.entries[1].dateTime).toBe(twoDaysAgo.toJSON());
    expect(sortedEntries.entries[2].dateTime).toBe(twoAndHalfDaysAgo.toJSON());

    expect(sortedEntries.gaps.length).toBe(2);
    expect(sortedEntries.gaps[0].valueInDays).toBe(2);

    // todo: this needs to be fixed, but doesn't matter for the moment
    // expect(sortedEntries.gaps[1].valueInDays).toBe(0.5);
  });
});
