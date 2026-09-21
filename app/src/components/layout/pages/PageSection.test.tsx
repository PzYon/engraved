import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PageSection } from "./PageSection";

describe("PageSection", () => {
  it("renders its children", () => {
    render(
      <PageSection>
        <span>content</span>
      </PageSection>,
    );

    expect(screen.getByText("content")).toBeDefined();
  });

  it("renders no title when none is given", () => {
    const { container } = render(
      <PageSection>
        <span>content</span>
      </PageSection>,
    );

    expect(container.querySelector("p")).toBeNull();
  });

  it("renders the title when one is given", () => {
    render(
      <PageSection title="My Section">
        <span>content</span>
      </PageSection>,
    );

    expect(screen.getByText("My Section")).toBeDefined();
  });

  it("renders the icon next to the title", () => {
    render(
      <PageSection title="My Section" icon={<span>icon</span>}>
        <span>content</span>
      </PageSection>,
    );

    expect(screen.getByText("icon")).toBeDefined();
  });

  it("renders no icon when only a title is given", () => {
    render(
      <PageSection title="My Section">
        <span>content</span>
      </PageSection>,
    );

    expect(screen.queryByText("icon")).toBeNull();
  });

  it("applies the test id", () => {
    render(
      <PageSection testId="my-section">
        <span>content</span>
      </PageSection>,
    );

    expect(screen.getByTestId("my-section")).toBeDefined();
  });

  it("scrolls horizontally when asked to", () => {
    render(
      <PageSection testId="my-section" overflowXScroll={true}>
        <span>content</span>
      </PageSection>,
    );

    expect(getComputedStyle(screen.getByTestId("my-section")).overflowX).toBe(
      "auto",
    );
  });

  it("does not scroll horizontally by default", () => {
    render(
      <PageSection testId="my-section">
        <span>content</span>
      </PageSection>,
    );

    expect(
      getComputedStyle(screen.getByTestId("my-section")).overflowX,
    ).not.toBe("auto");
  });

  it("merges the given style into the host", () => {
    render(
      <PageSection testId="my-section" style={{ color: "rgb(1, 2, 3)" }}>
        <span>content</span>
      </PageSection>,
    );

    expect(getComputedStyle(screen.getByTestId("my-section")).color).toBe(
      "rgb(1, 2, 3)",
    );
  });
});
