import { ISchedule } from "./ISchedule";

export interface IEntity {
  id?: string;
  editedOn?: string;
  schedules?: Record<string, ISchedule>;
}
