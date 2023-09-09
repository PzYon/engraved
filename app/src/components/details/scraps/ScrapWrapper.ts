import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import React from "react";

export class ScrapWrapper {
  constructor(
    private scrap: IScrapMeasurement,
    public setIsEditMode: () => void
  ) {}

  private ref: React.MutableRefObject<HTMLDivElement>;

  readonly reactKey = "react-key-" + Math.random().toString();

  get raw(): IScrapMeasurement {
    return this.scrap;
  }

  set raw(value: IScrapMeasurement) {
    this.scrap = value;
  }

  setRef(ref: React.MutableRefObject<HTMLDivElement>) {
    this.ref = ref;
  }

  giveFocus() {
    this.ref.current.focus();
  }
}
