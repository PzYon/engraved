import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import {
  chunkSize,
  useGraduallyRenderedItems,
} from "./useGraduallyRenderedItems";

function createItems(count: number) {
  return Array.from({ length: count }, (_, index) => `item ${index}`);
}

// Two full chunks and the beginning of a third one.
const longListLength = 2 * chunkSize + 5;

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
    const items = createItems(chunkSize);

    const { result } = renderGradually(items);

    expect(result.current).toBe(items);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("renders a long list chunk by chunk", () => {
    const items = createItems(longListLength);

    const { result } = renderGradually(items);
    expect(result.current).toEqual(items.slice(0, chunkSize));

    nextChunk();
    expect(result.current).toEqual(items.slice(0, 2 * chunkSize));

    nextChunk();
    expect(result.current).toBe(items);
    expect(vi.getTimerCount()).toBe(0);
  });

  it("starts with the first chunk when the items only arrive later", () => {
    const { result, rerender } = renderGradually([]);
    const items = createItems(longListLength);

    rerender({ items, index: -1 });

    expect(result.current).toEqual(items.slice(0, chunkSize));
  });

  it("brings items back gradually after there have been fewer", () => {
    const items = createItems(longListLength);
    const { result, rerender } = renderGradually(items);
    nextChunk();
    nextChunk();

    rerender({ items: items.slice(0, 3), index: -1 });
    expect(result.current).toHaveLength(3);

    rerender({ items, index: -1 });
    expect(result.current).toEqual(items.slice(0, chunkSize));
  });

  // The item with the focus cannot wait for its turn.
  it("renders up to the item that must be included right away", () => {
    const items = createItems(10 * chunkSize);

    const { result, rerender } = renderGradually(items, 4 * chunkSize);
    expect(result.current).toEqual(items.slice(0, 4 * chunkSize + 1));

    rerender({ items, index: items.length - 1 });
    expect(result.current).toBe(items);
  });

  it("stops adding chunks once it is unmounted", () => {
    const { unmount } = renderGradually(createItems(longListLength));

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
