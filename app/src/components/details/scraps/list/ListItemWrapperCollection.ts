import { ISCrapListItem } from "./IScrapListItem";
import { ListItemWrapper } from "./ListItemWrapper";

export class ListItemWrapperCollection {
  private wrappedItems: ListItemWrapper[];

  get items(): ISCrapListItem[] {
    return this.wrappedItems.map((i) => i.raw);
  }

  private get highestIndex() {
    return this.wrappedItems.length - 1;
  }

  constructor(
    rawItems: ISCrapListItem[],
    private onChange: (rawItems: ISCrapListItem[]) => void,
  ) {
    this.wrappedItems = rawItems.map((i) => new ListItemWrapper(i));
  }

  setRef(index: number, ref: React.MutableRefObject<HTMLInputElement>): void {
    this.wrappedItems[index].setRef(ref);
  }

  addItem(index: number) {
    if (index > 0 && !this.wrappedItems[index - 1].raw.label) {
      return;
    }

    const depth = index === 0 ? 0 : this.wrappedItems[index - 1].raw.depth;

    this.add(
      index,
      new ListItemWrapper({
        label: "",
        isCompleted: false,
        depth: depth,
      }),
    );
  }

  removeItem(index: number) {
    if (this.wrappedItems.length <= 1) {
      // we do not want to delete the last item
      return;
    }

    this.wrappedItems = this.wrappedItems.filter((_, i) => i !== index);

    this.wrappedItems[Math.min(index, this.highestIndex)].giveFocus();

    this.fireOnChange();
  }

  updateItem(index: number, updatedItem: ISCrapListItem) {
    if (!this.wrappedItems[index]) {
      // we cannot update an item, that does not exist anymore.
      // hack: we simply return here. the better solution would be to prevent
      // update being called on an item that does not exist anymore, but this
      // does not seam that easy at the moment...
      return;
    }

    this.wrappedItems[index].raw = updatedItem;
    this.fireOnChange();
  }

  giveFocus(index: number) {
    this.wrappedItems[index]?.giveFocus();
  }

  moveFocusUp(index: number) {
    this.giveFocus(this.getNextLowerIndex(index));
  }

  moveFocusDown(index: number) {
    this.giveFocus(this.getNextHigherIndex(index));
  }

  moveItemUp(index: number) {
    const lowerIndex = this.getNextLowerIndex(index);

    if (lowerIndex > index) {
      const item = this.wrappedItems.splice(0, 1);
      this.add(this.highestIndex + 1, item[0]);
      return;
    }

    const upperItem = this.wrappedItems[index];
    const lowerItem = this.wrappedItems[lowerIndex];

    this.wrappedItems[lowerIndex] = upperItem;
    this.wrappedItems[index] = lowerItem;

    this.fireOnChange();
  }

  moveItemDown(index: number) {
    const higherIndex = this.getNextHigherIndex(index);

    if (higherIndex < index) {
      const item = this.wrappedItems.splice(this.highestIndex, 1);
      this.add(0, item[0]);
      return;
    }

    const lowerItem = this.wrappedItems[index];
    const upperItem = this.wrappedItems[higherIndex];

    this.wrappedItems[higherIndex] = lowerItem;
    this.wrappedItems[index] = upperItem;

    this.fireOnChange();
  }

  moveItemLeft(index: number): void {
    if (this.getItemDepth(index) === 0) {
      return;
    }

    this.wrappedItems[index].raw.depth = this.getItemDepth(index) - 1;
    this.fireOnChange();
  }

  moveItemRight(index: number): void {
    if (this.getItemDepth(index) > this.getItemDepth(index - 1)) {
      return;
    }

    this.wrappedItems[index].raw.depth = this.getItemDepth(index) + 1;
    this.fireOnChange();
  }

  moveCheckedToBottom() {
    this.wrappedItems = this.wrappedItems.sort((a, b) => {
      return a.raw.isCompleted === b.raw.isCompleted
        ? 0
        : a.raw.isCompleted
          ? 1
          : -1;
    });

    this.fireOnChange();
  }

  toggleAllChecked() {
    const isMajorityCompleted =
      this.wrappedItems.filter((i) => i.raw.isCompleted).length >
      this.wrappedItems.length / 2;

    const areAllSameState =
      this.wrappedItems.filter((i) => i.raw.isCompleted === isMajorityCompleted)
        .length === this.wrappedItems.length;

    this.wrappedItems = this.wrappedItems.map((i) => {
      i.raw.isCompleted = areAllSameState
        ? !isMajorityCompleted
        : isMajorityCompleted;
      return i;
    });

    this.fireOnChange();
  }

  deleteAllChecked() {
    this.wrappedItems = this.wrappedItems.filter((i) => !i.raw.isCompleted);

    this.fireOnChange();
  }

  getReactKey(index: number): string {
    return this.wrappedItems[index].reactKey;
  }

  private add(index: number, ...listItems: ListItemWrapper[]) {
    this.wrappedItems.splice(index, 0, ...listItems);
    this.fireOnChange();
  }

  private fireOnChange() {
    this.onChange(this.items);
  }

  private getItemDepth(index: number) {
    // we need to access the depth-value like this because old items
    // might not have the depth value set
    return this.wrappedItems[index].raw.depth ?? 0;
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
