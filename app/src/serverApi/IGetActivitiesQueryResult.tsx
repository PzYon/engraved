import { IEntry } from "./IEntry";
import { IJournal } from "./IJournal";

export interface IGetActivitiesQueryResult {
  metrics: IJournal[];
  measurements: IEntry[];
}
