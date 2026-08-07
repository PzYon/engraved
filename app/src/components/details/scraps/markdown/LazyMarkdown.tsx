import React, { useMemo } from "react";
import { BasicMarkdownContainer, MarkdownContainer } from "./MarkdownContainer";
import { marked, Tokens } from "marked";
import DOMPurify from "dompurify";
import emojiRegex from "emoji-regex";
import { IMarkdownProps } from "./IMarkdownProps";
import { isFileReference } from "../../../../fileStorage/fileReferences";

const regex = emojiRegex();

// These renderers build HTML by hand, so anything interpolated into an attribute has to be escaped
// here - marked only does it for the renderers it ships. A read URL is the case that made this
// matter: the storage SDK leaves the quotes around the filename in "rscd=inline; filename="x.webp""
// unencoded, and one of those ends the src attribute early, cutting the signature off the URL.
function attr(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

const md = marked.use({
  // Render a single newline inside a block as a line break. The rich text editor
  // stores a hard break (Shift+Enter) as a lone "\n", and we want it to show up
  // as a visible line break rather than being collapsed into a space.
  breaks: true,
  renderer: {
    link({ href, title, text }: Tokens.Link) {
      return `<a href="${attr(href)}" ${title ? `title="${attr(title)}"` : ""} target="_blank" rel="noopener noreferrer">${text}</a>`;
    },

    image({ href, title, text }: Tokens.Image) {
      // A reference that still has no URL: its query has not come back yet, or the file is gone.
      // Rendering nothing beats rendering an <img> whose src the browser cannot fetch, which would
      // show a broken-image icon on every first paint.
      if (isFileReference(href)) {
        return "";
      }

      return `<img src="${attr(href)}" alt="${attr(text)}" ${title ? `title="${attr(title)}"` : ""} loading="lazy" />`;
    },
  },
  hooks: {
    postprocess: (html) => {
      return html.replace(
        regex,
        (emojiChar) => `<span class="ngrvd-emoji">${emojiChar}</span>`,
      );
    },
  },
});

const LazyMarkdown: React.FC<IMarkdownProps> = ({
  value,
  onClick,
  useBasic,
}) => {
  const html = useMemo<{ __html: string }>(
    () => ({ __html: getHtml(value, useBasic) }),
    [value, useBasic],
  );

  const El = useBasic ? BasicMarkdownContainer : MarkdownContainer;

  return <El onClick={onClick} dangerouslySetInnerHTML={html} />;
};

function getHtml(value: string, useBasic?: boolean) {
  if (!value) {
    return "";
  }

  const html = useBasic ? md.parseInline(value).toString() : parseBlocks(value);

  // The rendered markdown is injected via dangerouslySetInnerHTML, so it must
  // be sanitized to prevent stored XSS from user-provided content. ADD_ATTR
  // keeps the target="_blank" added by the link renderer.
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
}

// The rich text editor serializes empty paragraphs as extra blank lines (and, for
// the second one onwards, a literal "&nbsp;" line). marked collapses runs of blank
// lines, which would drop those empty paragraphs and make the rendered output lose
// the vertical spacing the user added in the editor. To keep the read-only view in
// sync with the editor, we split the markdown into paragraph blocks on blank-line
// boundaries and render each empty block as a visible empty paragraph. Non-empty
// blocks are handed to marked as usual, so multi-line constructs (lists, hard
// breaks, ...) - which use single newlines internally - keep rendering correctly.
function parseBlocks(value: string): string {
  const blocks = value
    .replace(/^[^\S\n]+$/gm, "") // treat whitespace-only lines as empty lines
    .split(/\n\n/);

  // Blank lines between content are the spacing the user added, but blank lines
  // after it are not: the editor's document always ends in a block, so leaving a
  // list (Enter on an empty item) drops the caret into an empty paragraph that is
  // then serialized along with the rest. Rendering that would put an empty line
  // between the content and whatever follows it - the entry footer, usually.
  while (blocks.length && isEmptyBlock(blocks[blocks.length - 1])) {
    blocks.pop();
  }

  return blocks
    .map((block) =>
      isEmptyBlock(block) ? "<p>&nbsp;</p>" : md.parse(block).toString(),
    )
    .join("");
}

function isEmptyBlock(block: string): boolean {
  const trimmed = block.trim();
  return trimmed === "" || trimmed === "&nbsp;";
}

export default LazyMarkdown;
