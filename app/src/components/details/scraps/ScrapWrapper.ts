import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import React from "react";

export class ScrapWrapper {
  constructor(
    private ref: React.MutableRefObject<HTMLDivElement>,
    public scrap: IScrapMeasurement,
    public setIsEditMode: () => void,
    public upsertScrap: () => Promise<void>,
    public reset: () => void
  ) {}

  giveFocus() {
    this.ref.current.focus();
  }
}
