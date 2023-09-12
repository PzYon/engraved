import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import React from "react";

export class ScrapWrapper {
  constructor(
    private scrap: IScrapMeasurement,
    private ref: React.MutableRefObject<HTMLDivElement>,
    public setIsEditMode: () => void,
    public upsertScrap: () => Promise<void>
  ) {}

  get raw(): IScrapMeasurement {
    return this.scrap;
  }

  set raw(value: IScrapMeasurement) {
    this.scrap = value;
  }

  giveFocus() {
    this.ref.current.focus();
  }
}
