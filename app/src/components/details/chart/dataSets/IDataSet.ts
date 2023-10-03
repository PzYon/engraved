import { ITransformedEntry } from "../transformation/ITransformedEntry";

export interface IDataSet {
  label: string;
  data: ITransformedEntry[];
}
