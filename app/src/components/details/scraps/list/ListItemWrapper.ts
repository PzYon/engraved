import { IScrapListItem } from "./IScrapListItem";
import React from "react";

export type CursorPosition = number | "beginning" | "end";

export class ListItemWrapper {
  constructor(
    private item: IScrapListItem,
    private giveFocusOnRef?: boolean,
  ) {}

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

    if (this.giveFocusOnRef) {
      this.ref.current?.focus();
      this.giveFocusOnRef = false;
    }
  }

  giveFocus(cursorPosition?: CursorPosition) {
    this.ref?.current?.focus();
    this.moveCursorToPosition(cursorPosition);
  }

  moveCursorToPosition(cursorPosition: CursorPosition) {
    if (cursorPosition === undefined) {
      return;
    }

    console.log("moving cursor to", cursorPosition);
  }
}
