import { IEntity } from "./IEntity";

export interface ISearchResultEntity {
  entity: IEntity;
  entityType: "Journal" | "Entry";
}
