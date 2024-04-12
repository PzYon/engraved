import { IRecurrence } from "./IRecurrence";

export interface IScheduleDefinition {
  nextOccurrence?: Date;
  recurrence?: IRecurrence;
  onClickUrl?: string;
}
