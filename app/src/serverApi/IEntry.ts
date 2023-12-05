import { IJournalAttributeValues } from "./IJournalAttributeValues";
import { IEntity } from "./IEntity";

export interface IEntry extends IEntity {
  notes?: string;
  dateTime: string;
  journalAttributeValues?: IJournalAttributeValues;
  parentId?: string;
}
