import { IJournalAttributeValues } from "../IJournalAttributeValues";

export interface IUpsertEntryCommand {
  id?: string;
  metricId: string;
  metricAttributeValues?: IJournalAttributeValues;
  notes?: string;
  dateTime?: Date;
}
