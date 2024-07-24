import React from "react";
import { IEntity } from "../../../../serverApi/IEntity";

export class OverviewItem {
  constructor(
    private ref: React.MutableRefObject<HTMLDivElement>,
    public internalObj: IEntity,
  ) {}

  giveFocus() {
    this.ref.current.focus();
  }
}
