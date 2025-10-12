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
    if (cursorPosition === undefined) {
      this.ref?.current?.focus();
      return;
    }

    this.ref?.current?.focus();

    setTimeout(() => {
      if (typeof cursorPosition === "string") {
        if (cursorPosition === "beginning") {
          this.fixThisSomeHowOrMoveToTextEditor();
          //this.ref?.current?.setSelectionRange(0, 0);
        } else {
          this.fixThisSomeHowOrMoveToTextEditor();
          /*this.ref?.current?.setSelectionRange(
            this.ref.current.value?.length ?? 0,
            this.ref.current.value?.length ?? 0,
          );*/
        }
      }

      if (typeof cursorPosition === "number" && cursorPosition >= 0) {
        this.ref?.current?.setSelectionRange(cursorPosition, cursorPosition);
      }
    });
  }

  fixThisSomeHowOrMoveToTextEditor() {
    const el = this.ref.current;
    if (el?.isContentEditable) {
      const range = document.createRange();
      range.setStart(el, 0);
      range.collapse(true);

      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  }
}
