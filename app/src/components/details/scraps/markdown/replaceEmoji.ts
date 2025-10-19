import emojiRegex from "emoji-regex";
import { renderEmoji } from "./renderEmoji";

const regex = emojiRegex();

export function replaceEmoji(text: string) {
  return text.replace(regex, (emojiChar, index, wholeString) => {
    if (
      index > 0 &&
      wholeString[index - 1] === ">" &&
      wholeString[index + 1] === "<"
    ) {
      return emojiChar;
    } else {
      return renderEmoji(emojiChar);
    }
  });
}
