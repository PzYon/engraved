import React from "react";

export abstract class BaseItemWrapper<TInternalType extends { id?: string }> {
  protected constructor(
    private ref: React.MutableRefObject<HTMLDivElement>,
    public internalObj: TInternalType
  ) {}

  giveFocus() {
    this.ref.current.focus();
  }
}
