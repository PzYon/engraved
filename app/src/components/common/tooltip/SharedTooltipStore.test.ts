import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SharedTooltipStore } from "./SharedTooltipStore";
import { tooltipEnterDelayMs } from "../../../theming/engravedTheme";

const edit = document.createElement("button");
const remove = document.createElement("button");

describe("SharedTooltipStore", () => {
  let store: SharedTooltipStore;

  beforeEach(() => {
    vi.useFakeTimers();
    store = new SharedTooltipStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  function showAndWait(ownerId: string, element: HTMLElement, title: string) {
    store.show(ownerId, element, title, false);
    vi.advanceTimersByTime(tooltipEnterDelayMs);
  }

  it("opens once the pointer has rested on an element", () => {
    store.show("edit", edit, "Edit", false);

    vi.advanceTimersByTime(tooltipEnterDelayMs - 1);
    expect(store.getState()).toBeUndefined();

    vi.advanceTimersByTime(1);
    expect(store.getState()).toEqual({
      ownerId: "edit",
      element: edit,
      title: "Edit",
      isOpen: true,
    });
  });

  it("does not open for a pointer that only passes by", () => {
    store.show("edit", edit, "Edit", false);
    vi.advanceTimersByTime(tooltipEnterDelayMs - 1);

    store.hide("edit", false);
    vi.advanceTimersByTime(tooltipEnterDelayMs);

    expect(store.getState()).toBeUndefined();
  });

  // It stays where it is, as it is still on screen while it fades out.
  it("closes at its element when the pointer leaves", () => {
    showAndWait("edit", edit, "Edit");

    store.hide("edit", false);

    expect(store.getState()).toEqual({
      ownerId: "edit",
      element: edit,
      title: "Edit",
      isOpen: false,
    });
  });

  it("opens at once for the next element", () => {
    showAndWait("edit", edit, "Edit");
    store.hide("edit", false);

    store.show("remove", remove, "Remove", false);

    expect(store.getState()).toMatchObject({ element: remove, isOpen: true });
  });

  it("waits again after a pause", () => {
    showAndWait("edit", edit, "Edit");
    store.hide("edit", false);
    vi.advanceTimersByTime(800);

    store.show("remove", remove, "Remove", false);

    expect(store.getState()).toMatchObject({ element: edit, isOpen: false });
  });

  // The keyboard focus is on one button while the pointer leaves another.
  it("is not closed by an element it is not at", () => {
    showAndWait("edit", edit, "Edit");

    store.hide("remove", false);

    expect(store.getState()).toMatchObject({ element: edit, isOpen: true });
  });

  it("opens after a long press and stays for a moment", () => {
    store.show("edit", edit, "Edit", true);

    vi.advanceTimersByTime(699);
    expect(store.getState()).toBeUndefined();

    vi.advanceTimersByTime(1);
    expect(store.getState()).toMatchObject({ isOpen: true });

    store.hide("edit", true);

    vi.advanceTimersByTime(1499);
    expect(store.getState()).toMatchObject({ isOpen: true });

    vi.advanceTimersByTime(1);
    expect(store.getState()).toMatchObject({ isOpen: false });
  });

  it("does not open for a tap", () => {
    store.show("edit", edit, "Edit", true);
    vi.advanceTimersByTime(100);

    store.hide("edit", true);
    vi.advanceTimersByTime(5000);

    expect(store.getState()).toBeUndefined();
  });

  it("is gone at once with its element", () => {
    showAndWait("edit", edit, "Edit");

    store.remove("edit");

    expect(store.getState()).toBeUndefined();
  });

  it("does not open for an element that is gone", () => {
    store.show("edit", edit, "Edit", false);

    store.remove("edit");
    vi.advanceTimersByTime(tooltipEnterDelayMs);

    expect(store.getState()).toBeUndefined();
    expect(vi.getTimerCount()).toBe(0);
  });

  it("stays when another element is gone", () => {
    showAndWait("edit", edit, "Edit");

    store.remove("remove");

    expect(store.getState()).toMatchObject({ element: edit, isOpen: true });
  });

  it("follows the title of its element", () => {
    showAndWait("edit", edit, "Edit");

    store.setTitle("remove", "Remove");
    expect(store.getState()).toMatchObject({ title: "Edit" });

    store.setTitle("edit", "Save");
    expect(store.getState()).toMatchObject({ title: "Save", isOpen: true });
  });

  it("opens with the title its element has by then", () => {
    store.show("edit", edit, "Edit", false);
    store.setTitle("edit", "Save");

    vi.advanceTimersByTime(tooltipEnterDelayMs);

    expect(store.getState()).toMatchObject({ title: "Save", isOpen: true });
  });

  it("can be closed without the pointer leaving", () => {
    showAndWait("edit", edit, "Edit");

    store.close();

    expect(store.getState()).toMatchObject({ element: edit, isOpen: false });
  });

  it("tells its subscribers about changes only", () => {
    const listener = vi.fn();
    const unsubscribe = store.subscribe(listener);

    showAndWait("edit", edit, "Edit");
    expect(listener).toHaveBeenCalledTimes(1);

    store.setTitle("edit", "Edit");
    store.hide("remove", false);
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    store.hide("edit", false);
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
