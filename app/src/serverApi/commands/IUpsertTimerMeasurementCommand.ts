import { IUpsertMeasurementCommand } from "./IUpsertMeasurementCommand";

export interface IUpsertTimerMeasurementCommand
  extends IUpsertMeasurementCommand {
  startDate: Date;
  endDate: Date;
}
