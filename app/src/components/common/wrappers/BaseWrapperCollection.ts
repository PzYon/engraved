import { BaseItemWrapper } from "./BaseItemWrapper";

export class BaseWrapperCollection<T extends BaseItemWrapper<{ id?: string }>> {
  getItemCount() {
    return this.wrappers.length;
  }

  private wrappers: T[] = [];

  get currentIndex() {
    return this.index;
  }

  get current(): T {
    return this.wrappers[this.index];
  }

  constructor(
    private index: number,
    private setFocusIndex: (value: number) => void,
  ) {}

  private get highestIndex() {
    return this.wrappers.length - 1;
  }

  protected setIndex(i: number) {
    this.index = i;
    this.setFocusIndex(i);
  }

  setFocus(index: number) {
    if (this.index === index) {
      // if item already has focus (or is the last one that had focus),
      // then do nothing in order to prevent cursors from moving around.
      return;
    }

    this.setIndex(index);
    this.current.giveFocus();
  }

  moveFocusDown() {
    this.setFocus(this.getNextHigherIndex(this.index));
  }

  moveFocusUp() {
    this.setFocus(this.getNextLowerIndex(this.index));
  }

  add(wrapper: T) {
    const existingIndex = this.wrappers.findIndex(
      (w) => w.internalObj.id === wrapper.internalObj.id,
    );

    if (existingIndex > -1) {
      this.wrappers[existingIndex] = wrapper;
    } else {
      this.wrappers.push(wrapper);
    }
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
