import { ISCrapListItem } from "./IScrapListItem";
import React from "react";

export class ListItemWrapper {
  constructor(private item: ISCrapListItem) {}

  private ref: React.MutableRefObject<HTMLInputElement>;

  readonly reactKey = "react-key-" + Math.random().toString();

  get raw(): ISCrapListItem {
    return this.item;
  }

  set raw(value: ISCrapListItem) {
    this.item = value;
  }

  setRef(ref: React.MutableRefObject<HTMLInputElement>) {
    this.ref = ref;
  }

  giveFocus() {
    this.ref?.current.focus();
  }
}
