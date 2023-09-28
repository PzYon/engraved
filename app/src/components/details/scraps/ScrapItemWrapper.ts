import { IScrapMeasurement } from "../../../serverApi/IScrapMeasurement";
import React from "react";
import { BaseItemWrapper } from "../../common/wrappers/BaseItemWrapper";

export class ScrapItemWrapper extends BaseItemWrapper<IScrapMeasurement> {
  constructor(
    ref: React.MutableRefObject<HTMLDivElement>,
    scrap: IScrapMeasurement,
    public setIsEditMode: () => void,
    public upsertScrap: () => Promise<void>,
  ) {
    super(ref, scrap);
  }
}
