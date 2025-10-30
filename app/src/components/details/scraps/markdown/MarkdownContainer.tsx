import { styled } from "@mui/material";

const BaseMarkdownContainer = styled("div")`
  overflow-x: auto;
  overflow-y: hidden;
  font-family: ${(p) => p.theme.typography.fontFamily};

  .ngrvd-emoji {
    font-size: 15px;
    margin-bottom: 3px;
  }

  p:first-of-type {
    margin-top: 0;
  }

  P:last-of-type {
    margin-bottom: 0;
  }

  p {
    display: flex;
    align-items: center;
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

export const BasicMarkdownContainer = styled(BaseMarkdownContainer)`
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

export const MarkdownContainer = styled(BaseMarkdownContainer)`
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
`;
