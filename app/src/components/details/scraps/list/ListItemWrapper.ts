import { IScrapListItem } from "./IScrapListItem";
import React from "react";

export type CursorPosition = number | "beginning" | "end";

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

  giveFocus(cursorPosition?: CursorPosition) {
    this.ref?.current?.focus();

    if (cursorPosition === undefined) {
      return;
    }

    if (typeof cursorPosition === "string") {
      setTimeout(() => {
        if (cursorPosition === "beginning") {
          this.ref?.current?.setSelectionRange(2, 2);
        } else {
          this.ref?.current?.setSelectionRange(
            this.ref.current.value.length,
            this.ref.current.value.length,
          );
        }
      });
    }

    if (typeof cursorPosition === "number" && cursorPosition > 0) {
      setTimeout(() => {
        this.ref?.current?.setSelectionRange(cursorPosition, cursorPosition);
      });
    }
  }
}
