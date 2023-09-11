import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import React from "react";

export class ScrapWrapper {
  constructor(
    private scrap: IScrapMeasurement,
    public setIsEditMode: () => void,
    private ref: React.MutableRefObject<HTMLDivElement>
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
