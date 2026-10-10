import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OverviewList } from "./OverviewList";
import { IEntity } from "../../../serverApi/IEntity";

// The real hooks hand out the same function on every render, which is what the
// list relies on to leave rows alone - so the mocks have to do the same.
const { navigate, setAppAlert } = vi.hoisted(() => ({
  navigate: vi.fn(),
  setAppAlert: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => navigate,
  useRouterState: () => "",
}));

vi.mock("../../../AppContext", () => ({
  useAppContext: () => ({ setAppAlert, user: { id: "user-id" } }),
}));

// Every row renders exactly one PageSection, which makes it a probe for how
// often a row is rendered.
const renderedSections = vi.fn();

vi.mock("../../layout/pages/PageSection", () => ({
  PageSection: ({ children }: { children: React.ReactNode }) => {
    renderedSections();
    return <div>{children}</div>;
  },
}));

const items: IEntity[] = [{ id: "one" }, { id: "two" }, { id: "three" }];

function renderItem(item: IEntity, _: number, hasFocus: boolean) {
  return <span>{`${item.id}${hasFocus ? " (focused)" : ""}`}</span>;
}

describe("OverviewList", () => {
  beforeEach(() => {
    renderedSections.mockClear();
  });

  it("renders only the row that receives the focus", () => {
    render(<OverviewList items={items} renderItem={renderItem} />);
    renderedSections.mockClear();

    fireEvent.click(screen.getByTestId("two"));

    expect(screen.getByText("two (focused)")).toBeTruthy();
    expect(renderedSections).toHaveBeenCalledTimes(1);
  });

  it("renders only the two rows involved when the focus moves on", () => {
    render(<OverviewList items={items} renderItem={renderItem} />);
    fireEvent.click(screen.getByTestId("two"));
    renderedSections.mockClear();

    fireEvent.click(screen.getByTestId("three"));

    expect(screen.getByText("three (focused)")).toBeTruthy();
    expect(screen.getByText("two")).toBeTruthy();
    expect(renderedSections).toHaveBeenCalledTimes(2);
  });
});
