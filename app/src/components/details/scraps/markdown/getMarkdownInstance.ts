import MarkdownIt from "markdown-it";
import { full as emoji } from "markdown-it-emoji";

const md = MarkdownIt("default", { linkify: true, breaks: true });
md.use(emoji);

export function getMarkdownInstance() {
  return md;
}
