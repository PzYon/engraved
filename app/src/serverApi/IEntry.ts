import { IJournalAttributeValues } from "./IJournalAttributeValues";
import { IEntity } from "./IEntity";
import { IFileRef } from "./IFileRef";

export interface IEntry extends IEntity {
  notes?: string;
  dateTime: string;
  journalAttributeValues?: IJournalAttributeValues;
  parentId?: string;
  files?: IFileRef[];
}
