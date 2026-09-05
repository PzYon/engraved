import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { GoToItemRow } from "./GoToItemRow";

let mockNavigate = vi.fn();
let hotkeyCallback:
  | ((keyboardEvent: KeyboardEvent, hotkeysEvent: unknown) => void)
  | undefined;
let latestLinkProps: { to: string; search?: Record<string, string> } | undefined;

vi.mock("@tanstack/react-router", () => ({
  Link: ({
    to,
    search,
    onClick,
    style,
    children,
  }: {
    to: string;
    search?: Record<string, string>;
    onClick?: () => void;
    style?: React.CSSProperties;
    children: React.ReactNode;
  }) => {
    latestLinkProps = { to, search };
    const href = new URL(to, "https://engraved.local");

    if (search) {
      href.search = new URLSearchParams(search).toString();
    }

    return (
      <a href={`${href.pathname}${href.search}`} onClick={onClick} style={style}>
        {children}
      </a>
    );
  },
  useNavigate: () => mockNavigate,
}));

vi.mock("../actions/useEngravedHotkeys", () => ({
  useEngravedHotkeys: (
    _hotkey: string | string[] | undefined,
    callback: (keyboardEvent: KeyboardEvent, hotkeysEvent: unknown) => void,
  ) => {
    hotkeyCallback = callback;
  },
}));

describe("GoToItemRow", () => {
  beforeEach(() => {
    mockNavigate = vi.fn();
    hotkeyCallback = undefined;
    latestLinkProps = undefined;
  });

  it("renders plain routes without search params", () => {
    render(
      <GoToItemRow url="/journals/details/123" hasFocus={false} icon={<span />}>
        Journal
      </GoToItemRow>,
    );

    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/journals/details/123",
    );
    expect(latestLinkProps).toEqual({ to: "/journals/details/123" });
  });

  it("separates query params for router links and keyboard navigation", () => {
    const onClick = vi.fn();

    render(
      <GoToItemRow
        url="/search?q=quarterback"
        hasFocus={true}
        icon={<span />}
        onClick={onClick}
      >
        Search
      </GoToItemRow>,
    );

    expect(screen.getByRole("link").getAttribute("href")).toBe(
      "/search?q=quarterback",
    );
    expect(latestLinkProps).toEqual({
      to: "/search",
      search: { q: "quarterback" },
    });

    fireEvent.click(screen.getByRole("link"));
    expect(onClick).toHaveBeenCalledOnce();

    hotkeyCallback?.({ preventDefault: vi.fn() } as unknown as KeyboardEvent, {});
    expect(mockNavigate).toHaveBeenCalledWith({
      to: "/search",
      search: { q: "quarterback" },
    });
  });
});
