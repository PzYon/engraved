import { getScheduleDefinitionForUpsert } from "./scheduleUtils";
import { IParsedDate } from "../../details/edit/parseDate";
import { ISchedule } from "../../../serverApi/ISchedule";

describe("getScheduleDefinitionForUpsert", () => {
  const journalId = "journal-1";
  const entryId = "entry-1";

  it("uses the date typed into the title when the title was edited", () => {
    const date = new Date(2030, 0, 1, 9, 0, 0);
    const parsedDate: IParsedDate = { input: "in 2h", date };

    const result = getScheduleDefinitionForUpsert(
      parsedDate,
      undefined,
      journalId,
      entryId,
    );

    expect(result.nextOccurrence).toEqual(date);
    expect(result.onClickUrl).toContain(journalId);
  });

  it("changes an existing schedule when a new date is typed", () => {
    const existing: ISchedule = {
      nextOccurrence: new Date(2030, 0, 1, 9, 0, 0).toISOString(),
    };
    const newDate = new Date(2031, 5, 15, 8, 0, 0);
    const parsedDate: IParsedDate = { input: "tomorrow", date: newDate };

    const result = getScheduleDefinitionForUpsert(
      parsedDate,
      existing,
      journalId,
      entryId,
    );

    expect(result.nextOccurrence).toEqual(newDate);
  });

  // This is the regression that auto-save introduced: saving without touching
  // the title must keep an already existing schedule instead of clearing it.
  it("preserves an existing schedule when the title was not touched", () => {
    const existing: ISchedule = {
      nextOccurrence: new Date(2030, 0, 1, 9, 0, 0).toISOString(),
      recurrence: { dateString: "every monday" },
    };

    const result = getScheduleDefinitionForUpsert(
      undefined,
      existing,
      journalId,
      entryId,
    );

    expect(result.nextOccurrence).toEqual(new Date(existing.nextOccurrence!));
    expect(result.recurrence).toEqual(existing.recurrence);
    expect(result.onClickUrl).toContain(journalId);
  });

  it("clears the schedule when nothing was typed and nothing exists", () => {
    const result = getScheduleDefinitionForUpsert(
      undefined,
      undefined,
      journalId,
      entryId,
    );

    expect(result.nextOccurrence).toBeNull();
    expect(result.onClickUrl).toBeNull();
  });

  it("does not preserve an existing schedule without a next occurrence", () => {
    const result = getScheduleDefinitionForUpsert(
      undefined,
      {},
      journalId,
      entryId,
    );

    expect(result.nextOccurrence).toBeNull();
  });

  it("keeps an existing schedule even when the title is edited without a date", () => {
    // editing the title to a non-date value must NOT remove the schedule - a
    // save can never remove a schedule, only the edit-schedule action can.
    const parsedDate: IParsedDate = { input: "groceries", text: "groceries" };
    const existing: ISchedule = {
      nextOccurrence: new Date(2030, 0, 1).toISOString(),
    };

    const result = getScheduleDefinitionForUpsert(
      parsedDate,
      existing,
      journalId,
      entryId,
    );

    expect(result.nextOccurrence).toEqual(new Date(existing.nextOccurrence!));
  });
});
