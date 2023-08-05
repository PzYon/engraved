import { ISCrapListItem } from "./IScrapListItem";

import { ListItemWrapper } from "./ListItemWrapper";

export class ListItemWrapperCollection {
  constructor(
    public items: ListItemWrapper[],
    private onChange: (value: ISCrapListItem[]) => void
  ) {}

  remove(index: number) {
    this.items = this.items.filter((_, i) => i !== index);
    this.giveFocus(index);
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

  private fireOnChange() {
    this.onChange(this.items.map((i) => i.raw));
  }
}
