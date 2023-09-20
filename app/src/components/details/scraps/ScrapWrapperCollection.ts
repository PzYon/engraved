import { ScrapWrapper } from "./ScrapWrapper";

export class ScrapWrapperCollection {
  private wrappers: ScrapWrapper[] = [];

  private index = -1;

  get current(): ScrapWrapper {
    return this.wrappers[this.index];
  }

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
    this.current.setIsEditMode();
  }

  async update() {
    await this.current.upsertScrap();
    this.index = -1;
  }

  setFocus(index: number) {
    if (this.index === index) {
      // if item already has focus (or is the last one that had focus),
      // then do nothing in order to prevent cursors from moving around.
      return;
    }

    this.index = index;
    this.current.giveFocus();
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
