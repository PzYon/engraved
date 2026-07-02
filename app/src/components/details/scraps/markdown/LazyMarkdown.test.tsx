import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import LazyMarkdown from "./LazyMarkdown";

describe("LazyMarkdown", () => {
  it("strips script tags from rendered markdown", () => {
    const { container } = render(
      <LazyMarkdown value={"<script>window.xss = true;</script>hello"} />,
    );

    expect(container.querySelector("script")).toBeNull();
    expect(container.innerHTML).not.toContain("<script");
  });

  it("strips inline event handler attributes", () => {
    const { container } = render(
      <LazyMarkdown value={'<img src="x" onerror="window.xss = true;">'} />,
    );

    expect(container.querySelector("img")?.getAttribute("onerror")).toBeNull();
  });

  it("removes javascript: urls from links", () => {
    const { container } = render(
      <LazyMarkdown value={"[click me](javascript:alert(1))"} />,
    );

    const href = container.querySelector("a")?.getAttribute("href") ?? "";
    expect(href.toLowerCase()).not.toContain("javascript:");
  });

  it("keeps safe links opening in a new tab", () => {
    const { container } = render(
      <LazyMarkdown value={"[example](https://example.com)"} />,
    );

    const anchor = container.querySelector("a");
    expect(anchor?.getAttribute("href")).toBe("https://example.com");
    expect(anchor?.getAttribute("target")).toBe("_blank");
  });

  it("renders regular markdown content", () => {
    const { container } = render(<LazyMarkdown value={"**bold**"} />);

    expect(container.querySelector("strong")?.textContent).toBe("bold");
  });
});
