import React, { useMemo } from "react";
import { IMarkdownProps } from "./Markdown";
import { getMarkedInstance } from "./getMarkedInstance";
import { BasicMarkdownContainer, MarkdownContainer } from "./MarkdownContainer";

const md = getMarkedInstance();

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
