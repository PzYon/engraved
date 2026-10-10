import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActionIconButtonGroup } from "./ActionIconButtonGroup";
import { IAction } from "./IAction";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
  useSearch: ({ select }: { select: (search: object) => unknown }) =>
    select({}),
}));

const observe = vi.fn();

class IntersectionObserverStub {
  observe = observe;
  disconnect = vi.fn();
}

const actions: IAction[] = [
  { key: "edit", label: "Edit", icon: <span>edit</span>, onClick: vi.fn() },
];

describe("ActionIconButtonGroup", () => {
  beforeEach(() => {
    observe.mockClear();
    vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // A group is rendered for every item of a list, and none of those has
  // floating actions.
  it("does not watch its position without floating actions", () => {
    render(<ActionIconButtonGroup actions={actions} />);

    expect(screen.getByLabelText("Edit")).toBeTruthy();
    expect(observe).not.toHaveBeenCalled();
  });

  it("watches its position when it has floating actions", () => {
    render(
      <ActionIconButtonGroup actions={actions} enableFloatingActions={true} />,
    );

    expect(observe).toHaveBeenCalledTimes(1);
    expect(observe.mock.calls[0][0]).toBeInstanceOf(HTMLDivElement);
  });
});
