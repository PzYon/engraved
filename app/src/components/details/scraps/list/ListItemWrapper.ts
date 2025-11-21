import { IScrapListItem } from "./IScrapListItem";

export type CursorPosition = number | "beginning" | "end";

export class ListItemWrapper {
  private giveFocusInternal: (cursorPosition: CursorPosition) => void;

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

  setGiveFocus(giveFocus: (cursorPosition: CursorPosition) => void) {
    this.giveFocusInternal = giveFocus;

    if (this.giveFocusOnRef) {
      this.giveFocus();
      this.giveFocusOnRef = false;
    }
  }

  giveFocus(cursorPosition?: CursorPosition) {
    this.giveFocusInternal?.(cursorPosition);
  }
}
