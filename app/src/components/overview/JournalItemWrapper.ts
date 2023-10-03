import { IJournal } from "../../serverApi/IJournal";
import React from "react";
import { BaseItemWrapper } from "../common/wrappers/BaseItemWrapper";

export class JournalItemWrapper extends BaseItemWrapper<IJournal> {
  constructor(ref: React.MutableRefObject<HTMLDivElement>, journal: IJournal) {
    super(ref, journal);
  }
}
