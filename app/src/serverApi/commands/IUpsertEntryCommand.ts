import { IJournalAttributeValues } from "../IJournalAttributeValues";

import { IScheduleDefinition } from "../IScheduleDefinition";

export interface IUpsertEntryCommand {
  id?: string;
  // true when the client generated the id itself (offline-capable create). Only such commands may
  // create an entry under an explicit id on the server; an update whose entry no longer exists is
  // discarded instead (see ICommandResult.discarded).
  isNew?: boolean;
  journalId: string;
  journalAttributeValues?: IJournalAttributeValues;
  notes?: string;
  dateTime?: Date;
  schedule?: IScheduleDefinition;
}
