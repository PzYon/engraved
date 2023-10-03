import { IEntry } from "./IEntry";

export interface ITimerEntry extends IEntry {
  startDate: string;
  endDate?: string;
}
