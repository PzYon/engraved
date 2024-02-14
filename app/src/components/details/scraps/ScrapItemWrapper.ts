import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import React from "react";
import { BaseItemWrapper } from "../../common/wrappers/BaseItemWrapper";

export class ScrapItemWrapper extends BaseItemWrapper<IScrapEntry> {
  constructor(
    ref: React.MutableRefObject<HTMLDivElement>,
    scrap: IScrapEntry,
    public upsertScrap: () => Promise<void>,
  ) {
    super(ref, scrap);
  }
}
