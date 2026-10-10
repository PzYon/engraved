import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { SharedTooltipProvider } from "./SharedTooltipProvider";
import { ActionIconButton } from "../actions/ActionIconButton";
import { IAction } from "../actions/IAction";
import { tooltipEnterDelayMs } from "../../../theming/engravedTheme";

const edit: IAction = {
  key: "edit",
  label: "Edit",
  hotkey: "alt+e",
  icon: <span>edit icon</span>,
  onClick: vi.fn(),
};

const remove: IAction = {
  key: "remove",
  label: "Remove",
  icon: <span>remove icon</span>,
  onClick: vi.fn(),
};

function renderButtons(...actions: IAction[]) {
  return (
    <SharedTooltipProvider>
      {actions.map((action) => (
        <ActionIconButton key={action.key} action={action} />
      ))}
    </SharedTooltipProvider>
  );
}

function wait(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

function hover(label: string) {
  fireEvent.pointerEnter(screen.getByLabelText(label));
  wait(tooltipEnterDelayMs);
}

describe("SharedTooltipProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders no tooltip as long as none is asked for", () => {
    render(renderButtons(edit, remove));

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows the label and the hotkey of the hovered button", () => {
    render(renderButtons(edit, remove));

    hover("Edit");

    expect(screen.getByRole("tooltip").textContent).toBe("Edit (alt+e)");
  });

  // The tooltip is a second element that knows the label - it must not be
  // found in place of the button.
  it("leaves the button the only element with its label", () => {
    render(renderButtons({ ...edit, hotkey: undefined }));

    hover("Edit");

    expect(screen.getAllByLabelText("Edit")).toHaveLength(1);
    expect(screen.queryAllByTitle("Edit")).toHaveLength(0);
  });

  it("moves on to the next button", () => {
    render(renderButtons(edit, remove));
    hover("Edit");

    fireEvent.pointerLeave(screen.getByLabelText("Edit"));
    fireEvent.pointerEnter(screen.getByLabelText("Remove"));

    expect(screen.getByRole("tooltip").textContent).toBe("Remove");
  });

  it("is gone after the pointer has left", () => {
    render(renderButtons(edit));
    hover("Edit");

    fireEvent.pointerLeave(screen.getByLabelText("Edit"));
    wait(1000);

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("is gone at once with its button", () => {
    const { rerender } = render(renderButtons(edit, remove));
    hover("Edit");

    rerender(renderButtons(remove));

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("follows the label of its button", () => {
    const { rerender } = render(renderButtons(edit));
    hover("Edit");

    rerender(renderButtons({ ...edit, hotkey: "alt+s" }));

    expect(screen.getByRole("tooltip").textContent).toBe("Edit (alt+s)");
  });

  it("is closed by the escape key", () => {
    render(renderButtons(edit));
    hover("Edit");

    fireEvent.keyDown(document.body, { key: "Escape" });
    wait(1000);

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("shows for a button reached with the keyboard", () => {
    render(renderButtons(edit));
    const button = screen.getByLabelText("Edit");

    // jsdom never considers a focus to be one of the keyboard.
    vi.spyOn(button, "matches").mockReturnValue(true);

    act(() => button.focus());
    wait(tooltipEnterDelayMs);

    expect(screen.getByRole("tooltip").textContent).toBe("Edit (alt+e)");

    act(() => button.blur());
    wait(1000);

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("does not show for a button that got the focus by being clicked", () => {
    render(renderButtons(edit));

    act(() => screen.getByLabelText("Edit").focus());
    wait(tooltipEnterDelayMs);

    expect(screen.queryByRole("tooltip")).toBeNull();
  });

  it("leaves a button without a provider as it is", () => {
    render(<ActionIconButton action={edit} />);

    hover("Edit");

    expect(screen.queryByRole("tooltip")).toBeNull();
  });
});
