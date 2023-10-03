import { IEntry } from "./IEntry";
import { IJournal } from "./IJournal";

export interface IGetAllEntriesQueryResult {
  journals: IJournal[];
  entries: IEntry[];
}
