import { ScrapWrapper } from "./ScrapWrapper";

export class ScrapWrapperCollection {
  private wrappers: ScrapWrapper[] = [];

  private index = -1;

  private get highestIndex() {
    return this.wrappers.length - 1;
  }

  add(scrapId: string, wrapper: ScrapWrapper) {
    const existingIndex = this.wrappers.findIndex(
      (w) => w.scrap.id === scrapId
    );

    if (existingIndex > -1) {
      this.wrappers[existingIndex] = wrapper;
    } else {
      this.wrappers.push(wrapper);
    }
  }

  setEditMode() {
    this.wrappers[this.index].setIsEditMode();
  }

  async update() {
    await this.wrappers[this.index].upsertScrap();
    this.index = -1;
  }

  setFocus(index: number) {
    this.index = index;
    this.wrappers[index].giveFocus();
    console.log("focus is at " + this.index);
  }

  moveFocusDown() {
    this.setFocus(this.getNextHigherIndex(this.index));
  }

  moveFocusUp() {
    this.setFocus(this.getNextLowerIndex(this.index));
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
