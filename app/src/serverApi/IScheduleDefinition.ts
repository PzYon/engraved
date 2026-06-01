import { IRecurrence } from "./IRecurrence";

export interface IScheduleDefinition {
  nextOccurrence: Date | null;
  recurrence?: IRecurrence;
  onClickUrl: string | null;
}
