import React from "react";
import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { AppMenu } from "./AppMenu";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string }) => <a href={to} {...props} />,
}));

vi.mock("../../../serverApi/reactQuery/queries/useJournalsQuery", () => ({
  useJournalsQuery: () => [],
}));

vi.mock("./useRecentlyViewedJournals", () => ({
  useRecentlyViewedJournals: () => ({ journals: [], isLoading: false }),
}));

const pressKey = (key: string) =>
  fireEvent.keyDown(document.activeElement!, { key });

const focusedText = () => document.activeElement?.textContent;

describe("AppMenu", () => {
  it("has no item focused when opened", () => {
    render(<AppMenu close={vi.fn()} />);

    expect(document.activeElement?.hasAttribute("data-app-menu-item")).toBe(
      false,
    );
  });

  it("focuses the first item on arrow down when none is focused", () => {
    render(<AppMenu close={vi.fn()} />);

    pressKey("ArrowDown");
    expect(focusedText()).toBe("Tags");
  });

  it("focuses the last item on arrow up when none is focused", () => {
    render(<AppMenu close={vi.fn()} />);

    pressKey("ArrowUp");
    expect(focusedText()).toBe("Recently viewed");
  });

  it("moves the focus with the arrow keys and wraps around", () => {
    render(<AppMenu close={vi.fn()} />);

    pressKey("ArrowDown");
    pressKey("ArrowDown");
    expect(focusedText()).toBe("Journals");

    pressKey("ArrowUp");
    pressKey("ArrowUp");
    expect(focusedText()).toBe("Recently viewed");

    pressKey("ArrowDown");
    expect(focusedText()).toBe("Tags");
  });

  it("keeps arrow keys from reaching handlers outside of the menu", () => {
    const outsideHandler = vi.fn();
    document.addEventListener("keydown", outsideHandler);

    render(<AppMenu close={vi.fn()} />);
    pressKey("ArrowDown");

    document.removeEventListener("keydown", outsideHandler);
    expect(outsideHandler).not.toHaveBeenCalled();
  });

  it("toggles a section with enter", () => {
    render(<AppMenu close={vi.fn()} />);

    pressKey("ArrowUp");
    pressKey("ArrowUp");
    expect(focusedText()).toBe("Favorites");

    expect(screen.queryByTestId("ExpandLessIcon")).toBeNull();

    pressKey("Enter");
    expect(screen.getByTestId("ExpandLessIcon")).toBeDefined();
  });
});
