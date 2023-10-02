import { IEntry } from "./IEntry";
import { IJournal } from "./IJournal";

export interface IGetActivitiesQueryResult {
  journals: IJournal[];
  entries: IEntry[];
}
