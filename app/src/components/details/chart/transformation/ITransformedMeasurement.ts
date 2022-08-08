import { IMeasurement } from "../../../../serverApi/IMeasurement";

export interface ITransformedMeasurement {
  x: Date | string;
  y: number;
  measurements: IMeasurement[];
}
