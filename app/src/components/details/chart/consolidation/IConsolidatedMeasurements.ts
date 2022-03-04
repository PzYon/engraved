import { ConsolidationKey } from "./ConsolidationKey";
import { IMeasurement } from "../../../../serverApi/IMeasurement";

export interface IConsolidatedMeasurements {
  value: number;
  groupKey: ConsolidationKey;
  measurements: IMeasurement[];
}
