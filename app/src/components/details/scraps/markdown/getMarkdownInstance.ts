import { full as emoji } from "markdown-it-emoji";
import markdownit from "markdown-it";
import emojiRegex from "emoji-regex";

const md = markdownit({ linkify: true, breaks: true }).use(emoji, {
  defs: { attention: "⚠️", question: "❓" },
  shortcuts: { attention: ["!!!"], question: ["???"] },
});

md.renderer.rules.emoji = function (token, idx) {
  return `<span class="ngrvd-emoji">${token[idx].content}</span>`;
};

const regex = emojiRegex();

md.renderer.rules.text = function (tokens, idx) {
  const content = tokens[idx].content;
  const containsEmoji = regex.test(content);

  if (!containsEmoji) {
    return `<span class="ngrvd-text">${content}</span>`;
  }

  const result: string[] = [];

  const matchAll = Array.from(content.matchAll(regex));
  for (const match of matchAll) {
    const emoji = match[0];

    result.push(
      content.replaceAll(emoji, `<span class="ngrvd-emoji">${emoji}</span>`),
    );

    console.log("Replaced " + emoji + " // new content: " + content);
  }

  return result.join();
};

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
