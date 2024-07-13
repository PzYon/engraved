import MarkdownIt from "markdown-it";

const md = MarkdownIt("default", { linkify: true, breaks: true });

export function getMarkdownInstance() {
  return md;
}
