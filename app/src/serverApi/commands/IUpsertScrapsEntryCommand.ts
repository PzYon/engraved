import { IUpsertEntryCommand } from "./IUpsertEntryCommand";
import { ScrapType } from "../IScrapEntry";

export interface IUpsertScrapsEntryCommand extends IUpsertEntryCommand {
  title: string;
  scrapType: ScrapType;
}
