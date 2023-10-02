import { IJournalAttributeValues } from "../IJournalAttributeValues";

export interface IUpsertEntryCommand {
  id?: string;
  journalId: string;
  journalAttributeValues?: IJournalAttributeValues;
  notes?: string;
  dateTime?: Date;
}
