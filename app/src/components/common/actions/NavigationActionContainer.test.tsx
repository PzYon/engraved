import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render } from "@testing-library/react";
import { NavigationActionContainer } from "./NavigationActionContainer";

const closeAction = vi.fn();

vi.mock("./searchParamHooks", () => ({
  useItemAction: () => ({ closeAction }),
}));

describe("NavigationActionContainer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    closeAction.mockClear();
    Element.prototype.scrollIntoView = vi.fn();

    render(
      <NavigationActionContainer>
        <span>content</span>
      </NavigationActionContainer>,
    );

    // ClickAwayListener only starts listening after a tick
    act(() => vi.runOnlyPendingTimers());
  });

  it("closes the action when the mouse is released outside of it", () => {
    fireEvent.mouseUp(document.body);

    expect(closeAction).toHaveBeenCalledTimes(1);
  });

  it("does not close the action when a touch ends outside of it", () => {
    fireEvent.touchEnd(document.body);

    expect(closeAction).not.toHaveBeenCalled();
  });
});
