import { IJournalAttributeValues } from "./IJournalAttributeValues";

export interface IEntry {
  id?: string;
  notes?: string;
  dateTime: string;
  editedOn?: string;
  journalAttributeValues?: IJournalAttributeValues;
  parentId?: string;
}
