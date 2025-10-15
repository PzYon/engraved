import React, { useMemo } from "react";
import { styled } from "@mui/material";
import { IMarkdownProps } from "./Markdown";
import { getMarkdownInstance } from "./getMarkdownInstance";

const md = getMarkdownInstance();

const LazyMarkdown: React.FC<IMarkdownProps> = ({
  value,
  onClick,
  useBasic,
}) => {
  const html = useMemo<{ __html: string }>(
    () => ({ __html: value ? md.render(value) : "" }),
    [value],
  );

  const El = useBasic ? BasicContentContainer : ContentContainer;

  return <El onClick={onClick} dangerouslySetInnerHTML={html} />;
};

const BaseContentContainer = styled("div")`
  overflow: auto;
  font-family: ${(p) => p.theme.typography.fontFamily};

  background-color: lightgray;

  margin: 20px;

  .ngrvd-emoji {
    font-size: smaller;
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
  }
`;

const BasicContentContainer = styled(BaseContentContainer)`
  p,
  h1,
  h2,
  h3 h4,
  h5,
  h6,
  li {
    margin: 0;
    font-size: 1rem;
  }
`;

const ContentContainer = styled(BaseContentContainer)`
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

export default LazyMarkdown;
