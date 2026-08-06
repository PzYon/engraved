import { describe, expect, it } from "vitest";
import { Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Markdown } from "@tiptap/markdown";
import Image from "@tiptap/extension-image";

// StarterKit carries no image node, so the editor would otherwise drop an image on the way in and
// there would be nothing to serialize on the way out. What these assert is that adding the extension
// is enough - that @tiptap/markdown parses and serializes the node without a custom serializer.
// Everything the placeholder rewriting does rests on this, so it is worth stating as a test rather
// than assuming.
describe("rich text editor images", () => {
  it("keeps an image when markdown goes in and comes back out", () => {
    const markdown = "![holiday](https://files.example/abc)";

    expect(roundTrip(markdown)).toContain(
      "![holiday](https://files.example/abc)",
    );
  });

  it("keeps an image that is not a URL, so a placeholder survives editing", () => {
    const markdown = "![holiday](engraved:file/abc.signature)";

    expect(roundTrip(markdown)).toContain(
      "![holiday](engraved:file/abc.signature)",
    );
  });

  it("keeps an image sitting between paragraphs", () => {
    const markdown = "before\n\n![holiday](engraved:file/abc)\n\nafter";

    const result = roundTrip(markdown);

    expect(result).toContain("before");
    expect(result).toContain("![holiday](engraved:file/abc)");
    expect(result).toContain("after");
  });
});

function roundTrip(markdown: string) {
  const editor = new Editor({
    extensions: [StarterKit, Markdown, Image],
    content: markdown,
    contentType: "markdown",
  });

  const result = editor.getMarkdown();

  editor.destroy();

  return result;
}
