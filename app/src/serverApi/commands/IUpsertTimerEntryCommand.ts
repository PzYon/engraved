import { IUpsertEntryCommand } from "./IUpsertEntryCommand";

export interface IUpsertTimerEntryCommand extends IUpsertEntryCommand {
  startDate: Date;
  endDate: Date;
}
