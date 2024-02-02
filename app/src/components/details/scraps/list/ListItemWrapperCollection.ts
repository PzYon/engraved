import { ISCrapListItem } from "./IScrapListItem";
import { ListItemWrapper } from "./ListItemWrapper";

export class ListItemWrapperCollection {
  items: ListItemWrapper[];

  private get highestIndex() {
    return this.items.length - 1;
  }

  constructor(
    rawItems: ISCrapListItem[],
    private onChange: (rawItems: ISCrapListItem[]) => void,
  ) {
    this.items = rawItems.map((i) => new ListItemWrapper(i));
  }

  addItem(index: number) {
    if (index > 0 && !this.items[index - 1].raw.label) {
      return;
    }

    this.add(
      index,
      new ListItemWrapper({
        label: "",
        isCompleted: false,
        depth: 0,
      }),
    );
  }

  removeItem(index: number) {
    if (this.items.length <= 1) {
      // we do not want to delete the last item
      return;
    }

    this.items = this.items.filter((_, i) => i !== index);

    this.items[Math.min(index, this.highestIndex)].giveFocus();

    this.fireOnChange();
  }

  updateItem(index: number, updatedItem: ISCrapListItem) {
    if (!this.items[index]) {
      // we cannot update an item, that does not exist anymore.
      // hack: we simply return here. the better solution would be to prevent
      // update being called on an item that does not exist anymore, but this
      // does not seam that easy at the moment...
      return;
    }

    this.items[index].raw = updatedItem;
    this.fireOnChange();
  }

  giveFocus(index: number) {
    this.items[index]?.giveFocus();
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
      const item = this.items.splice(0, 1);
      this.add(this.highestIndex + 1, item[0]);
    } else {
      const upperItem = this.items[index];
      const lowerItem = this.items[lowerIndex];

      this.items[lowerIndex] = upperItem;
      this.items[index] = lowerItem;
    }

    this.fireOnChange();
  }

  moveItemDown(index: number) {
    const higherIndex = this.getNextHigherIndex(index);

    if (higherIndex < index) {
      const item = this.items.splice(this.highestIndex, 1);
      this.add(0, item[0]);
    } else {
      const lowerItem = this.items[index];
      const upperItem = this.items[higherIndex];

      this.items[higherIndex] = lowerItem;
      this.items[index] = upperItem;
    }

    this.fireOnChange();
  }

  moveItemLeft(index: number): void {
    if (this.getItemDepth(index) === 0) {
      return;
    }

    this.items[index].raw.depth = this.getItemDepth(index) - 1;
    this.fireOnChange();
  }

  moveItemRight(index: number): void {
    if (this.getItemDepth(index) > this.getItemDepth(index - 1)) {
      return;
    }

    this.items[index].raw.depth = this.getItemDepth(index) + 1;
    this.fireOnChange();
  }

  moveCheckedToBottom() {
    this.items = this.items.sort((a, b) => {
      return a.raw.isCompleted === b.raw.isCompleted
        ? 0
        : a.raw.isCompleted
          ? 1
          : -1;
    });

    this.fireOnChange();
  }

  toggleChecked() {
    const isMajorityCompleted =
      this.items.filter((i) => i.raw.isCompleted).length >
      this.items.length / 2;

    const areAllSameState =
      this.items.filter((i) => i.raw.isCompleted === isMajorityCompleted)
        .length === this.items.length;

    this.items = this.items.map((i) => {
      i.raw.isCompleted = areAllSameState
        ? !isMajorityCompleted
        : isMajorityCompleted;
      return i;
    });

    this.fireOnChange();
  }

  deleteChecked() {
    this.items = this.items.filter((i) => !i.raw.isCompleted);

    this.fireOnChange();
  }

  private add(index: number, ...listItems: ListItemWrapper[]) {
    this.items.splice(index, 0, ...listItems);
    this.fireOnChange();
  }

  private fireOnChange() {
    this.onChange(this.items.map((i) => i.raw));
  }

  private getItemDepth(index: number) {
    // we need to access the depth-value like this because old items
    // might not have the depth value set
    return this.items[index].raw.depth ?? 0;
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
