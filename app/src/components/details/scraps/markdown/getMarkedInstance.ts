import emojiRegex from "emoji-regex";
import { marked } from "marked";

const regex = emojiRegex();

const markedInstance = marked.use({
  hooks: {
    postprocess: (html) => {
      return html.replace(
        regex,
        (emojiChar) => `<span class="ngrvd-emoji">${emojiChar}</span>`,
      );
    },
  },
});

export function getMarkedInstance() {
  return markedInstance;
}
