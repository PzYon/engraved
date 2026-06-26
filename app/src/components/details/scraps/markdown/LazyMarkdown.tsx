import React, { useMemo } from "react";
import { IMarkdownProps } from "./Markdown";
import { BasicMarkdownContainer, MarkdownContainer } from "./MarkdownContainer";
import { marked, Tokens } from "marked";
import DOMPurify from "dompurify";
import emojiRegex from "emoji-regex";

const regex = emojiRegex();

const md = marked.use({
  renderer: {
    link({ href, title, text }: Tokens.Link) {
      return `<a href="${href}" ${title ? `title="${title}"` : ""} target="_blank" rel="noopener noreferrer">${text}</a>`;
    },
  },
  hooks: {
    preprocess: (markdown: string) => {
      return markdown.replace(/(?<!\n)\n(?!\n)/g, "\n\n");
    },
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

  const html = useBasic
    ? md.parseInline(value).toString()
    : md.parse(value).toString();

  // The rendered markdown is injected via dangerouslySetInnerHTML, so it must
  // be sanitized to prevent stored XSS from user-provided content. ADD_ATTR
  // keeps the target="_blank" added by the link renderer.
  return DOMPurify.sanitize(html, { ADD_ATTR: ["target"] });
}

export default LazyMarkdown;
