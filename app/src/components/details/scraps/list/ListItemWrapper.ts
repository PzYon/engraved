import { IScrapListItem } from "./IScrapListItem";

export type CursorPosition = number | "beginning" | "end";

export class ListItemWrapper {
  private giveFocusInternal: () => void;

  readonly reactKey = "react-key-" + Math.random().toString().split(".")[1];

  constructor(
    private item: IScrapListItem,
    private giveFocusOnRef?: boolean,
  ) {}

  get raw(): IScrapListItem {
    return this.item;
  }

  set raw(value: IScrapListItem) {
    this.item = value;
  }

  setGiveFocus(giveFocus: () => void) {
    this.giveFocusInternal = giveFocus;

    if (this.giveFocusOnRef) {
      this.giveFocus();
      this.giveFocusOnRef = false;
    }
  }

  giveFocus(cursorPosition?: CursorPosition) {
    this.giveFocusInternal?.();
    console.log(cursorPosition);
    //this.moveCursorToPosition(cursorPosition);
  }

  moveCursorToPosition(cursorPosition: CursorPosition) {
    if (cursorPosition === undefined) {
      return;
    }

    console.log("moving cursor to", cursorPosition);
  }
}
