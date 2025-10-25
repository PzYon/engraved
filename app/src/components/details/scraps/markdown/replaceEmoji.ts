import emojiRegex from "emoji-regex";
import { renderEmoji } from "./renderEmoji";

const regex = emojiRegex();

export function replaceEmoji(text: string) {
  return text.replace(regex, (emojiChar) => renderEmoji(emojiChar));
}
