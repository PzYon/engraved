import { ITransformedMeasurement } from "../transformation/ITransformedMeasurement";

export interface IDataSet {
  label: string;
  data: ITransformedMeasurement[];
}
