import { IRecurrence } from "../IRecurrence";

interface IAddScheduleCommand {
  nextOccurrence: Date;
  recurrence?: IRecurrence;
  onClickUrl: string;
}

export interface IAddScheduleToEntryCommand extends IAddScheduleCommand {
  entryId?: string;
}

export interface IAddScheduleToJournalCommand extends IAddScheduleCommand {
  journalId?: string;
}
