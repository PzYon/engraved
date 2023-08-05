import { ISCrapListItem } from "./IScrapListItem";

import { ListItemWrapper } from "./ListItemWrapper";

export class ListItemWrapperCollection {
  constructor(
    public items: ListItemWrapper[],
    private onChange: (value: ISCrapListItem[]) => void
  ) {}

  remove(index: number) {
    this.items = this.items.filter((_, i) => i !== index);
    this.giveFocus(Math.min(index, this.items.length - 1));
    this.fireOnChange();
  }

  add(index: number, ...listItems: ListItemWrapper[]) {
    this.items.splice(index, 0, ...listItems);
    this.fireOnChange();
  }

  update(index: number, updatedItem: ISCrapListItem) {
    this.items[index].raw = updatedItem;
    this.fireOnChange();
  }

  giveFocus(index: number) {
    this.items[index].giveFocus();
  }

  moveUp(index: number) {
    const lower = this.items[index];
    const upper = this.items[index - 1];

    this.items[index - 1] = lower;
    this.items[index] = upper;
  }

  moveDown(index: number) {
    const upper = this.items[index];
    const lower = this.items[index + 1];

    this.items[index + 1] = upper;
    this.items[index] = lower;
  }

  private fireOnChange() {
    this.onChange(this.items.map((i) => i.raw));
  }
}
