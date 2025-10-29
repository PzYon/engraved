import { marked } from "marked";
import { replaceEmoji } from "./replaceEmoji";

const markedInstance = marked.use({
  hooks: {
    postprocess: (html) => {
      return replaceEmoji(html);
    },
  },
});

export function getMarkedInstance() {
  return markedInstance;
}
