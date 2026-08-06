import { describe, expect, it } from "vitest";
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

  // The stored markdown comes from the rich text editor (@tiptap/markdown). The
  // expectations below mirror how the editor serializes content, so the read-only
  // view matches what the user typed:
  //   - a hard break (Shift+Enter) is a lone "\n" inside a single paragraph
  //   - two paragraphs are separated by "\n\n"
  //   - each additional blank line the user adds is an empty paragraph, encoded
  //     as an extra "\n\n" (and, from the second one on, a literal "&nbsp;" line)

  it("renders a single newline as a line break, not an empty paragraph", () => {
    const { container } = render(
      <LazyMarkdown value={"Paragraph 1\nParagraph 2"} />,
    );

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(1);
    expect(paragraphs[0].querySelector("br")).not.toBeNull();
    expect(paragraphs[0].innerHTML).not.toContain("&nbsp;");
    expect(paragraphs[0].textContent).toBe("Paragraph 1Paragraph 2");
  });

  it("renders a plain paragraph break without an empty paragraph", () => {
    const { container } = render(
      <LazyMarkdown value={"Paragraph 1\n\nParagraph 2"} />,
    );

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe("Paragraph 1");
    expect(paragraphs[1].textContent).toBe("Paragraph 2");
    expect(container.innerHTML).not.toContain("&nbsp;");
  });

  it("treats a whitespace-only line as a plain paragraph break", () => {
    const { container } = render(
      <LazyMarkdown value={"Paragraph 1\n \nParagraph 2"} />,
    );

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(2);
    expect(paragraphs[0].textContent).toBe("Paragraph 1");
    expect(paragraphs[1].textContent).toBe("Paragraph 2");
    expect(container.innerHTML).not.toContain("&nbsp;");
  });

  it("renders one blank line (four newlines) as one visible empty paragraph", () => {
    const { container } = render(
      <LazyMarkdown value={"Paragraph 1\n\n\n\nParagraph 2"} />,
    );

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(3);
    expect(paragraphs[0].textContent).toBe("Paragraph 1");
    expect(paragraphs[1].innerHTML).toBe("&nbsp;");
    expect(paragraphs[2].textContent).toBe("Paragraph 2");
  });

  it("renders two blank lines as two visible empty paragraphs", () => {
    const { container } = render(
      <LazyMarkdown value={"Paragraph 1\n\n\n\n&nbsp;\n\nParagraph 2"} />,
    );

    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(4);
    expect(paragraphs[0].textContent).toBe("Paragraph 1");
    expect(paragraphs[1].innerHTML).toBe("&nbsp;");
    expect(paragraphs[2].innerHTML).toBe("&nbsp;");
    expect(paragraphs[3].textContent).toBe("Paragraph 2");
  });

  // Images the markdown places by file id are resolved to a signed URL before they get here. One
  // that arrives unresolved has no URL yet, or points at a file that is gone - either way an <img>
  // with a src the browser cannot fetch would show a broken-image icon on first paint.
  it("renders nothing for a file reference that was not resolved", () => {
    const { container } = render(
      <LazyMarkdown value={"![holiday](engraved:file/abc.signature)"} />,
    );

    expect(container.querySelector("img")).toBeNull();
    expect(container.innerHTML).not.toContain("engraved:file");
  });

  it("renders a resolved image", () => {
    const { container } = render(
      <LazyMarkdown value={"![holiday](https://files.example/abc?sig=x)"} />,
    );

    const image = container.querySelector("img");
    expect(image?.getAttribute("src")).toBe("https://files.example/abc?sig=x");
    expect(image?.getAttribute("alt")).toBe("holiday");
  });

  // A read URL carries the file name in a response-header override, and the storage SDK leaves the
  // quotes around it unencoded. Interpolated into an attribute unescaped, the first of those quotes
  // ends src early - the browser then requests a URL with no signature on it and storage answers
  // 403, which looks exactly like the image simply not being there.
  it("keeps a src containing quotes intact", () => {
    const url =
      'https://files.example/abc?rscd=inline%3B+filename%3D"holiday.webp"&rsct=image%2Fwebp&sig=abc%3D';

    const { container } = render(<LazyMarkdown value={`![holiday](${url})`} />);

    expect(container.querySelector("img")?.getAttribute("src")).toBe(url);
  });

  it("keeps a link href containing quotes intact", () => {
    const url = 'https://example.com/a?name="x"&b=1';

    const { container } = render(<LazyMarkdown value={`[click](${url})`} />);

    expect(container.querySelector("a")?.getAttribute("href")).toBe(url);
  });

  it("keeps multi-line markdown blocks (bullet list) intact", () => {
    const { container } = render(<LazyMarkdown value={"- one\n- two"} />);

    const items = container.querySelectorAll("li");
    expect(items).toHaveLength(2);
    expect(items[0].textContent).toBe("one");
    expect(items[1].textContent).toBe("two");
  });
});
