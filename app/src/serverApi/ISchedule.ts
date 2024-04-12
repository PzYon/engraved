import { IRecurrence } from "./IRecurrence";

export interface ISchedule {
  nextOccurrence?: string;
  recurrence?: IRecurrence;
}
