import { IScrapListItem } from "./IScrapListItem";
import React from "react";

export class ListItemWrapper {
  constructor(private item: IScrapListItem) {}

  private ref: React.RefObject<HTMLInputElement>;

  readonly reactKey = "react-key-" + Math.random().toString().split(".")[1];

  get raw(): IScrapListItem {
    return this.item;
  }

  set raw(value: IScrapListItem) {
    this.item = value;
  }

  setRef(ref: React.RefObject<HTMLInputElement>) {
    this.ref = ref;
  }

  giveFocus() {
    this.ref?.current?.focus();
  }
}
