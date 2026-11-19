import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { focusManager } from "@tanstack/react-query";
import { useNow, useToday } from "./useNow";

describe("useNow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    focusManager.setFocused(true);
  });

  afterEach(() => {
    focusManager.setFocused(undefined);
    vi.useRealTimers();
  });

  const renderConsumers = () => {
    const autoUpdating = vi.fn();
    const focusOnly = vi.fn();

    const AutoUpdating = () => {
      autoUpdating(useNow(true));
      return null;
    };

    const FocusOnly = () => {
      focusOnly(useNow(false));
      return null;
    };

    render(
      <>
        <AutoUpdating />
        <FocusOnly />
      </>,
    );

    autoUpdating.mockClear();
    focusOnly.mockClear();

    return { autoUpdating, focusOnly };
  };

  it("refreshes only auto-updating consumers on the interval", () => {
    const { autoUpdating, focusOnly } = renderConsumers();

    act(() => vi.advanceTimersByTime(30_000));

    expect(autoUpdating).toHaveBeenCalledTimes(1);
    expect(focusOnly).not.toHaveBeenCalled();
  });

  it("refreshes all consumers when the window regains focus", () => {
    const { autoUpdating, focusOnly } = renderConsumers();

    act(() => {
      vi.advanceTimersByTime(1_000);
      focusManager.setFocused(false);
    });

    expect(autoUpdating).not.toHaveBeenCalled();
    expect(focusOnly).not.toHaveBeenCalled();

    act(() => focusManager.setFocused(true));

    expect(autoUpdating).toHaveBeenCalledTimes(1);
    expect(focusOnly).toHaveBeenCalledTimes(1);
  });
});

describe("useToday", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 10, 18, 23, 59, 0));
    focusManager.setFocused(true);
  });

  afterEach(() => {
    focusManager.setFocused(undefined);
    vi.useRealTimers();
  });

  const renderConsumer = () => {
    const consumer = vi.fn();

    const Consumer = () => {
      consumer(useToday());
      return null;
    };

    render(<Consumer />);

    return consumer;
  };

  it("does not re-render while the day stays the same", () => {
    const consumer = renderConsumer();
    consumer.mockClear();

    act(() => vi.advanceTimersByTime(30_000));

    expect(consumer).not.toHaveBeenCalled();
  });

  it("returns the new day once it has started", () => {
    const consumer = renderConsumer();

    expect(consumer).toHaveBeenLastCalledWith("2026-11-18");

    act(() => vi.advanceTimersByTime(60_000));

    expect(consumer).toHaveBeenLastCalledWith("2026-11-19");
  });

  it("returns the new day when the window regains focus on it", () => {
    const consumer = renderConsumer();

    act(() => focusManager.setFocused(false));
    // While in the background, timers are throttled and may not fire at all.
    vi.setSystemTime(new Date(2026, 10, 19, 8, 0, 0));
    act(() => focusManager.setFocused(true));

    expect(consumer).toHaveBeenLastCalledWith("2026-11-19");
  });
});
