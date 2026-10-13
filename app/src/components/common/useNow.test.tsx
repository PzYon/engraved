import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@testing-library/react";
import { focusManager } from "@tanstack/react-query";
import { useNow } from "./useNow";

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
