import { IUpsertEntryCommand } from "./IUpsertEntryCommand";

export interface IUpsertGaugeEntryCommand extends IUpsertEntryCommand {
  value: number;
}
