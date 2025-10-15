import { full as emoji } from "markdown-it-emoji";
import markdownit from "markdown-it";

const md = markdownit({ linkify: true, breaks: true }).use(emoji, {
  defs: { attention: "⚠️", question: "❓" },
  shortcuts: { attention: ["!!!"], question: ["???"] },
});

md.renderer.rules.emoji = function (token, idx) {
  return `<span class="emoji">${token[idx].content}</span>`;
};

export function getMarkdownInstance() {
  return md;
}
