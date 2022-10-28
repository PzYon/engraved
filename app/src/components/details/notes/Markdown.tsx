import MarkdownIt from "markdown-it";
import React, { useMemo } from "react";
import styled from "styled-components";

export const Markdown: React.FC<{ value: string }> = ({ value }) => {
  const mdAsHtml = useMemo(() => {
    if (!value) {
      return null;
    }

    return (
      MarkdownIt("default", { linkify: true })
        //.use(require("markdown-it-anchor").default)
        //.use(require("markdown-it-table-of-contents"))
        .render(value)
    );
  }, [value]);

  return <ContentContainer dangerouslySetInnerHTML={{ __html: mdAsHtml }} />;
};

const ContentContainer = styled("div")`
  overflow: auto;

  h1,
  h2,
  h3 {
    margin: 1rem 0;
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

  div > :first-child {
    margin-top: 0 !important;
  }

  div > :last-child {
    margin-bottom: 0 !important;
  }
`;
