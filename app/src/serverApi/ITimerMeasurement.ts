import { IMeasurement } from "./IMeasurement";

export interface ITimerMeasurement extends IMeasurement {
  startDate: string;
  endDate?: string;
}
