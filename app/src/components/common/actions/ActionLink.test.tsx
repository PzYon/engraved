import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ActionLink } from "./ActionLink";
import { AppSearch } from "./searchParamHooks";

const { navigate } = vi.hoisted(() => ({ navigate: vi.fn() }));

// The router's Link reduced to what matters here: where it leads, given the
// params that are in the URL at the moment.
const currentSearch: AppSearch = { q: "text", "selected-item": "other" };

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
  Link: ({
    to,
    search,
    children,
  }: {
    to: string;
    search: (current: AppSearch) => AppSearch;
    children: React.ReactNode;
  }) => (
    <a
      href={`${to}?${new URLSearchParams(search(currentSearch) as Record<string, string>)}`}
    >
      {children}
    </a>
  ),
}));

describe("ActionLink", () => {
  it("adds the params of its action to the ones in the URL", () => {
    render(
      <ActionLink
        action={{
          key: "delete",
          label: "Delete",
          icon: <span>delete</span>,
          search: { "action-key": "delete", "selected-item": "mine" },
        }}
      />,
    );

    expect(screen.getByText("delete").closest("a")?.getAttribute("href")).toBe(
      ".?q=text&selected-item=mine&action-key=delete",
    );
  });

  // What is in the URL of the app means nothing to another site - and used to
  // end up in the path of the link.
  it("leaves the params of the app out of an external link", () => {
    render(
      <ActionLink
        action={{
          key: "github",
          label: "View on Github",
          icon: <span>github</span>,
          href: "https://github.com/PzYon/engraved",
        }}
      />,
    );

    expect(screen.getByText("github").closest("a")?.getAttribute("href")).toBe(
      "https://github.com/PzYon/engraved",
    );
  });
});
