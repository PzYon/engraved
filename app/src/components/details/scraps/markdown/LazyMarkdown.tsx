import React, { useMemo } from "react";
import { BasicMarkdownContainer, MarkdownContainer } from "./MarkdownContainer";
import { marked, Tokens } from "marked";
import DOMPurify from "dompurify";
import emojiRegex from "emoji-regex";
import { IMarkdownProps } from "./IMarkdownProps";
import { isFileReference } from "../../../../fileStorage/fileReferences";

const regex = emojiRegex();

const md = marked.use({
  // Render a single newline inside a block as a line break. The rich text editor
  // stores a hard break (Shift+Enter) as a lone "\n", and we want it to show up
  // as a visible line break rather than being collapsed into a space.
  breaks: true,
  renderer: {
    link({ href, title, text }: Tokens.Link) {
      return `<a href="${href}" ${title ? `title="${title}"` : ""} target="_blank" rel="noopener noreferrer">${text}</a>`;
    },

    image({ href, title, text }: Tokens.Image) {
      // A reference that still has no URL: its query has not come back yet, or the file is gone.
      // Rendering nothing beats rendering an <img> whose src the browser cannot fetch, which would
      // show a broken-image icon on every first paint.
      if (isFileReference(href)) {
        return "";
      }

      return `<img src="${href}" alt="${text}" ${title ? `title="${title}"` : ""} loading="lazy" />`;
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
  return value
    .replace(/^[^\S\n]+$/gm, "") // treat whitespace-only lines as empty lines
    .split(/\n\n/)
    .map((block) => {
      const trimmed = block.trim();
      return trimmed === "" || trimmed === "&nbsp;"
        ? "<p>&nbsp;</p>"
        : md.parse(block).toString();
    })
    .join("");
}

export default LazyMarkdown;
