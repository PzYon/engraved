import { IEntry } from "../../../serverApi/IEntry";

export interface IEntriesTableGroup {
  label: string;
  entries: IEntry[];
  totalValue: number;
  totalString: string;
}
