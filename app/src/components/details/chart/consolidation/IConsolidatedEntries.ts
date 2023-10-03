import { ConsolidationKey } from "./ConsolidationKey";
import { IEntry } from "../../../../serverApi/IEntry";

export interface IConsolidatedEntries {
  value: number;
  groupKey: ConsolidationKey;
  entries: IEntry[];
}
