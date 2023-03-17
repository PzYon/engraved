import { IUpsertMeasurementCommand } from "./IUpsertMeasurementCommand";

export interface IUpsertScrapsMeasurementCommand
  extends IUpsertMeasurementCommand {
  title: string;
}
