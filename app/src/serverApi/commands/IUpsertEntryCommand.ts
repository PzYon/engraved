import { IJournalAttributeValues } from "../IJournalAttributeValues";

import { IScheduleDefinition } from "../IScheduleDefinition";
import { IFileRef } from "../IFileRef";

export interface IUpsertEntryCommand {
  id?: string;
  journalId: string;
  journalAttributeValues?: IJournalAttributeValues;
  notes?: string;
  dateTime?: Date;
  schedule?: IScheduleDefinition;

  // Always the full list the entry should end up with, never a delta: leaving one out removes it.
  files?: IFileRef[];
}
