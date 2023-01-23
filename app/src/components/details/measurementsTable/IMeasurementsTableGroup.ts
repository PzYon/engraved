import { IMeasurement } from "../../../serverApi/IMeasurement";

export interface IMeasurementsTableGroup {
  label: string;
  measurements: IMeasurement[];
  totalValue: number;
  totalString: string;
}
