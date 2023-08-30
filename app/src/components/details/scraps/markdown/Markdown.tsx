import MarkdownIt from "markdown-it";
import React, { MouseEventHandler, useMemo } from "react";
import { styled } from "@mui/material";

export const Markdown: React.FC<{
  value: string;
  onClick?: MouseEventHandler;
}> = ({ value, onClick }) => {
  const html = useMemo<string>(
    () => (value ? MarkdownIt("default", { linkify: true }).render(value) : ""),
    [value]
  );

  console.log(html);

  return (
    <ContentContainer
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const ContentContainer = styled("div")`
  overflow: auto;

  font-family: ${(p) => p.theme.typography.fontFamily};

  h1,
  h2,
  h3 {
    margin: 1rem 0;
    font-weight: normal;
  }

  p,
  h4,
  h5,
  h6,
  li {
    margin: 0.5rem 0;
  }

  h1 {
    font-size: 1.3rem;
  }

  h2 {
    font-size: 1.15rem;
  }

  h3 {
    font-size: 1rem;
  }

  ul {
    margin: 0.5rem 0;
    padding-left: 1rem;
    list-style-type: circle;
  }

  pre > code {
    overflow-y: auto;
    display: block;
    box-sizing: border-box;
    width: 100%;
    padding: 0.7rem;
  }

  img {
    max-width: 100%;
  }

  div > :first-of-type {
    margin-top: 0 !important;
  }

  div > :last-child {
    margin-bottom: 0 !important;
  }
`;
