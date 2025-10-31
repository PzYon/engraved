import React, { useMemo } from "react";
import { IMarkdownProps } from "./Markdown";
import { BasicMarkdownContainer, MarkdownContainer } from "./MarkdownContainer";
import { marked } from "marked";
import emojiRegex from "emoji-regex";

const regex = emojiRegex();

const md = marked.use({
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
    () => ({ __html: value ? md.parse(value).toString() : "" }),
    [value],
  );

  const El = useBasic ? BasicMarkdownContainer : MarkdownContainer;

  return <El onClick={onClick} dangerouslySetInnerHTML={html} />;
};

export default LazyMarkdown;
