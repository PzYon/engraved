import { IJournalAttributeValues } from "../IJournalAttributeValues";
import { IScheduleDefinition } from "../reactQuery/mutations/useModifyScheduleMutation";

export interface IUpsertEntryCommand {
  id?: string;
  journalId: string;
  journalAttributeValues?: IJournalAttributeValues;
  notes?: string;
  dateTime?: Date;
  schedule?: IScheduleDefinition;
}
