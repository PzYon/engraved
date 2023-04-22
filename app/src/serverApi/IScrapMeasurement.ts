import { IMeasurement } from "./IMeasurement";

export enum ScrapType {
  Markdown,
  List,
}

export interface IScrapMeasurement extends IMeasurement {
  title: string;
  scrapType: ScrapType;
}
