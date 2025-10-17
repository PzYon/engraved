import { full as emoji } from "markdown-it-emoji";
import markdownit from "markdown-it";
import emojiRegex from "emoji-regex";

const regex = emojiRegex();

const md = markdownit({ linkify: true, breaks: true }).use(emoji, {
  defs: { attention: "⚠️", question: "❓" },
  shortcuts: { attention: ["!!!"], question: ["???"] },
});

md.renderer.rules.emoji = function (token, idx) {
  return renderEmoji(token[idx].content);
};

md.renderer.rules.text = function (tokens, idx) {
  const content = tokens[idx].content;
  return content.replace(regex, renderEmoji);
};

function renderEmoji(content: string) {
  return `<span class="ngrvd-emoji">${content}</span>`;
}

// https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md#renderer
const defaultRender =
  md.renderer.rules.link_open ||
  function (tokens, idx, options, _, self) {
    return self.renderToken(tokens, idx, options);
  };

md.renderer.rules.link_open = function (tokens, idx, options, env, self) {
  tokens[idx].attrSet("target", "_blank");
  return defaultRender(tokens, idx, options, env, self);
};

export function getMarkdownInstance() {
  return md;
}
