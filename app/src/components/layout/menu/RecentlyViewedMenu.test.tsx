import React from "react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { RecentlyViewedMenu } from "./RecentlyViewedMenu";
import { IJournal } from "../../../serverApi/IJournal";

const route = vi.hoisted(() => ({
  journalId: undefined as string | undefined,
}));

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string }) => <a href={to} {...props} />,
  useMatchRoute: () => () =>
    route.journalId ? { journalId: route.journalId } : false,
}));

const recentlyViewed = vi.hoisted(() => ({ journals: [] as IJournal[] }));

vi.mock("./useRecentlyViewedJournals", () => ({
  useRecentlyViewedJournals: () => recentlyViewed.journals,
}));

vi.mock("../../overview/journals/JournalIcon", () => ({
  JournalIcon: () => null,
}));

vi.mock("../../common/actions/ActionIconButton", () => ({
  ActionIconButton: () => null,
}));

vi.mock("../../common/actions/ActionFactory", () => ({
  ActionFactory: { addEntry: () => ({}) },
}));

const journal = (id: string, name: string) => ({ id, name }) as IJournal;

describe("RecentlyViewedMenu", () => {
  beforeEach(() => {
    recentlyViewed.journals = [];
    route.journalId = undefined;
  });

  it("does not list the journal currently being viewed", () => {
    recentlyViewed.journals = [journal("b", "Current"), journal("a", "Older")];
    route.journalId = "b";

    render(<RecentlyViewedMenu close={vi.fn()} />);

    expect(screen.getAllByRole("link").map((l) => l.textContent)).toEqual([
      "Older",
    ]);
  });

  it("shows a hint when only the current journal was viewed", () => {
    recentlyViewed.journals = [journal("b", "Current")];
    route.journalId = "b";

    render(<RecentlyViewedMenu close={vi.fn()} />);

    expect(screen.getByText("No other journals viewed yet.")).toBeDefined();
  });

  it("lists the most recently viewed journal last, linking to their details", () => {
    recentlyViewed.journals = [journal("b", "Newest"), journal("a", "Older")];

    render(<RecentlyViewedMenu close={vi.fn()} />);

    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(["Older", "Newest"]);
    expect(links[1].getAttribute("href")).toBe("/journals/details/b");
  });

  it("shows a hint when no journals were viewed yet", () => {
    render(<RecentlyViewedMenu close={vi.fn()} />);

    expect(screen.getByText("No journals viewed yet.")).toBeDefined();
  });

  it("closes when a journal is clicked", () => {
    recentlyViewed.journals = [journal("a", "First")];
    const close = vi.fn();

    render(<RecentlyViewedMenu close={close} />);
    // clicking the button itself (not the link) avoids jsdom navigating
    fireEvent.click(
      screen.getByText("First").closest(".MuiListItemButton-root")!,
    );

    expect(close).toHaveBeenCalled();
  });

  it("focuses the most recently viewed journal on arrow up", () => {
    recentlyViewed.journals = [journal("b", "Newest"), journal("a", "Older")];

    render(<RecentlyViewedMenu close={vi.fn()} />);
    fireEvent.keyDown(document.activeElement!, { key: "ArrowUp" });

    expect(document.activeElement?.textContent).toBe("Newest");
  });
});
