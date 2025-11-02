import React, { useMemo } from "react";
import { IMarkdownProps } from "./Markdown";
import { BasicMarkdownContainer, MarkdownContainer } from "./MarkdownContainer";
import { marked, Tokens } from "marked";
import emojiRegex from "emoji-regex";

const regex = emojiRegex();

const md = marked.use({
  renderer: {
    link({ href, title, text }: Tokens.Link) {
      return `<a href="${href}" ${title ? `title="${title}"` : ""} target="_blank" rel="noopener noreferrer">${text}</a>`;
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

  if (useBasic) {
    return md.parseInline(value).toString();
  }

  return md.parse(value).toString();
}

export default LazyMarkdown;
