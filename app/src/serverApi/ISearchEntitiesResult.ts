import { IJournal } from "./IJournal";

import { ISearchResultEntity } from "./ISearchResultEntity";

export interface ISearchEntitiesResult {
  entities: ISearchResultEntity[];
  journals: IJournal[];
}
