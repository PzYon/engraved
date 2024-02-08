import { ISCrapListItem } from "./IScrapListItem";
import { ListItemWrapper } from "./ListItemWrapper";

export class ListItemCollection {
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

  getReactKey(index: number): string {
    return this.wrappedItems[index].reactKey;
  }

  getItemIndex(key: string): number {
    return this.wrappedItems.findIndex((i) => i.reactKey === key);
  }

  addItem(index: number) {
    const isFirst = index <= 0;

    if (!isFirst && !this.wrappedItems[index].raw.label) {
      return;
    }

    const depth = isFirst ? 0 : this.getItemDepth(index);

    this.add(
      index + 1,
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
      this.moveItemVertically(0, this.highestIndex + 1);
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
      this.moveItemVertically(this.highestIndex, 0);
      return;
    }

    const lowerItem = this.wrappedItems[index];
    const upperItem = this.wrappedItems[higherIndex];

    this.wrappedItems[higherIndex] = lowerItem;
    this.wrappedItems[index] = upperItem;

    this.fireOnChange();
  }

  moveItemVertically(index: number, newIndex: number) {
    const item = this.wrappedItems.splice(index, 1)[0];
    this.add(newIndex, item);
  }

  moveItemLeft(index: number): void {
    this.moveItemToDepth(index, this.getItemDepth(index) - 1);
  }

  moveItemRight(index: number): void {
    this.moveItemToDepth(index, this.getItemDepth(index) + 1);
  }

  moveItem(index: number, newIndex: number, newDepth: number) {
    this.moveItemVertically(index, newIndex);
    this.moveItemToDepth(newIndex, newDepth);
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

  private add(index: number, ...listItems: ListItemWrapper[]) {
    this.wrappedItems.splice(index, 0, ...listItems);
    this.fireOnChange();
  }

  private moveItemToDepth(index: number, newDepth: number) {
    const targetDepth =
      index === 0 || newDepth < 0
        ? 0
        : Math.min(newDepth, this.wrappedItems[index - 1].raw.depth + 1);

    if (targetDepth === this.wrappedItems[index].raw.depth) {
      return;
    }

    this.wrappedItems[index].raw.depth = targetDepth;

    this.fireOnChange();
  }

  private fireOnChange() {
    this.onChange(this.items);
  }

  private getItemDepth(index: number) {
    // we need to access the depth-value like this because old items
    // might not have the depth value set
    return this.wrappedItems[index]?.raw.depth ?? 0;
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
