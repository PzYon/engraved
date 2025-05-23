import { OverviewItem } from "./OverviewItem";

export class OverviewItemCollection {
  private wrappers: OverviewItem[] = [];
  private onType?: () => void;

  private get highestIndex() {
    return this.wrappers.length - 1;
  }

  constructor(
    public currentIndex: number = 1,
    private onIndexChange: (itemId: string, index: number) => void,
  ) {}

  setOnType(onType: () => void): () => void {
    this.onType = onType;

    document.addEventListener("keydown", this.onTypeInternal);

    return () => document.removeEventListener("keydown", this.onTypeInternal);
  }

  private onTypeInternal = (e: KeyboardEvent) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && !e.altKey) {
      this.setFocus(-1);
      this.onType?.();
    }
  };

  setFocusForId(itemId: string) {
    this.setFocus(this.getExistingIndex(itemId) ?? -1);
  }

  setFocus(index: number) {
    if (this.currentIndex === index) {
      // if an item already has focus (or is the last one that had focus),
      // then do nothing to prevent cursors from moving around.
      return;
    }

    this.currentIndex = index;

    const current = this.wrappers[this.currentIndex];
    current?.giveFocus();

    this.onIndexChange(current?.internalObj.id, index);
  }

  moveFocusDown() {
    this.setFocus(this.getNextHigherIndex(this.currentIndex));
  }

  moveFocusUp() {
    this.setFocus(this.getNextLowerIndex(this.currentIndex));
  }

  add(wrapper: OverviewItem) {
    const existingIndex = this.getExistingIndex(wrapper.internalObj.id);

    if (existingIndex > -1) {
      this.wrappers[existingIndex] = wrapper;
    } else {
      this.wrappers.push(wrapper);
    }
  }

  private getExistingIndex(itemId: string) {
    return this.wrappers.findIndex((w) => w.internalObj.id === itemId);
  }

  private getNextHigherIndex(index: number) {
    const nextIndex = index + 1;
    return nextIndex > this.highestIndex ? 0 : nextIndex;
  }

  private getNextLowerIndex(index: number) {
    const nextIndex = index - 1;
    return nextIndex < 0 ? this.highestIndex : nextIndex;
  }
}
