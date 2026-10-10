import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useGraduallyRenderedItems } from "./useGraduallyRenderedItems";

function createItems(count: number) {
  return Array.from({ length: count }, (_, index) => `item ${index}`);
}

function renderGradually(initialItems: string[], mustIncludeIndex = -1) {
  return renderHook(
    ({ items, index }) => useGraduallyRenderedItems(items, index),
    { initialProps: { items: initialItems, index: mustIncludeIndex } },
  );
}

// Lets the task run in which the next chunk is added.
function nextChunk() {
  act(() => {
    vi.runOnlyPendingTimers();
  });
}

describe("useGraduallyRenderedItems", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a short list at once", () => {
    const items = createItems(10);

    const { result } = renderGradually(items);

    expect(result.current).toBe(items);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("renders a long list chunk by chunk", () => {
    const items = createItems(25);

    const { result } = renderGradually(items);
    expect(result.current).toEqual(items.slice(0, 10));

    nextChunk();
    expect(result.current).toEqual(items.slice(0, 20));

    nextChunk();
    expect(result.current).toBe(items);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("starts with the first chunk when the items only arrive later", () => {
    const { result, rerender } = renderGradually([]);
    const items = createItems(25);

    rerender({ items, index: -1 });

    expect(result.current).toEqual(items.slice(0, 10));
  });

  it("brings items back gradually after there have been fewer", () => {
    const items = createItems(25);
    const { result, rerender } = renderGradually(items);
    nextChunk();
    nextChunk();

    rerender({ items: items.slice(0, 3), index: -1 });
    expect(result.current).toHaveLength(3);

    rerender({ items, index: -1 });
    expect(result.current).toEqual(items.slice(0, 10));
  });

  // The item with the focus cannot wait for its turn.
  it("renders up to the item that must be included right away", () => {
    const items = createItems(100);

    const { result, rerender } = renderGradually(items, 44);
    expect(result.current).toEqual(items.slice(0, 45));

    rerender({ items, index: 99 });
    expect(result.current).toBe(items);
  });

  it("stops adding chunks once it is unmounted", () => {
    const { unmount } = renderGradually(createItems(25));

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
