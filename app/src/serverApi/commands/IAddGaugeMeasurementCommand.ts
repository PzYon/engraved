import { IAddMeasurementCommand } from "./IAddMeasurementCommand";

export interface IAddGaugeMeasurementCommand extends IAddMeasurementCommand {
  value: number;
}
