import React from "react";
import { IEntity } from "../../../serverApi/IEntity";

export abstract class BaseItemWrapper<TInternalType extends IEntity> {
  protected constructor(
    private ref: React.MutableRefObject<HTMLDivElement>,
    public internalObj: TInternalType,
  ) {}

  giveFocus() {
    this.ref.current.focus();
  }
}
