import { ScrapWrapper } from "./ScrapWrapper";

export class ScrapWrapperCollection {
  private wrappers: ScrapWrapper[] = [];

  private index = -1;

  add(wrapper: ScrapWrapper) {
    this.wrappers.push(wrapper);
  }

  setEditMode() {
    this.wrappers[this.index].setIsEditMode();
  }

  moveFocusDown() {
    this.index = this.index + 1;
    this.wrappers[this.index].giveFocus();
  }

  moveFocusUp() {
    this.index = this.index - 1;
    this.wrappers[this.index].giveFocus();
  }
}
