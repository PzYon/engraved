import { IJournalAttributeValues } from "../IJournalAttributeValues";

import { IScheduleDefinition } from "../IScheduleDefinition";

export interface IUpsertEntryCommand {
  id?: string;
  journalId: string;
  journalAttributeValues?: IJournalAttributeValues;
  notes?: string;
  dateTime?: Date;
  schedule?: IScheduleDefinition;
}
