import { marked } from "marked";
import { replaceEmoji } from "./replaceEmoji";

export function getMarkedInstance() {
  marked.use({
    hooks: {
      postprocess: (html) => {
        return replaceEmoji(html);
      },
    },
  });

  return marked;
}
