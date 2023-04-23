import { IUpsertMeasurementCommand } from "./IUpsertMeasurementCommand";
import { ScrapType } from "../IScrapMeasurement";

export interface IUpsertScrapsMeasurementCommand
  extends IUpsertMeasurementCommand {
  title: string;
  scrapType: ScrapType;
}
