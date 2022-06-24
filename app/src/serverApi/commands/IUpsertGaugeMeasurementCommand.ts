import { IUpsertMeasurementCommand } from "./IUpsertMeasurementCommand";

export interface IUpsertGaugeMeasurementCommand
  extends IUpsertMeasurementCommand {
  value: number;
}
