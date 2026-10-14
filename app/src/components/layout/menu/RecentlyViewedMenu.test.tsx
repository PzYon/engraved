import React from "react";
import { beforeEach, describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { RecentlyViewedMenu } from "./RecentlyViewedMenu";
import { IJournal } from "../../../serverApi/IJournal";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, ...props }: { to: string }) => <a href={to} {...props} />,
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
  });

  it("lists the recently viewed journals in order, linking to their details", () => {
    recentlyViewed.journals = [journal("b", "Second"), journal("a", "First")];

    render(<RecentlyViewedMenu close={vi.fn()} />);

    const links = screen.getAllByRole("link");
    expect(links.map((l) => l.textContent)).toEqual(["Second", "First"]);
    expect(links[0].getAttribute("href")).toBe("/journals/details/b");
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

  it("moves the focus with the arrow keys", () => {
    recentlyViewed.journals = [journal("b", "Second"), journal("a", "First")];

    render(<RecentlyViewedMenu close={vi.fn()} />);
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });
    fireEvent.keyDown(document.activeElement!, { key: "ArrowDown" });

    expect(document.activeElement?.textContent).toBe("First");
  });
});
