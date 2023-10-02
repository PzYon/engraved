import { IEntry } from "./IEntry";

export enum ScrapType {
  Markdown = "Markdown",
  List = "List",
}

export interface IScrapEntry extends IEntry {
  title: string;
  scrapType: ScrapType;
}
