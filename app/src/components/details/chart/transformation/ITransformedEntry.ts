import { IEntry } from "../../../../serverApi/IEntry";

export interface ITransformedEntry {
  x: Date | string;
  y: number;
  measurements: IEntry[];
}
