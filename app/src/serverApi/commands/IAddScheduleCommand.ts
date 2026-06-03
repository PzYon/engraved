import { IRecurrence } from "../IRecurrence";

interface IAddScheduleCommand {
  nextOccurrence: Date | null;
  recurrence?: IRecurrence;
  onClickUrl: string | null;
}

export interface IAddScheduleToEntryCommand extends IAddScheduleCommand {
  entryId?: string;
}

export interface IAddScheduleToJournalCommand extends IAddScheduleCommand {
  journalId?: string;
}
