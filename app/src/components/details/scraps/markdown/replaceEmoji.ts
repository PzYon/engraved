import { renderEmoji } from "./renderEmoji";
import emojiRegex from "emoji-regex";

const regex = emojiRegex();

export function replaceEmoji(content: string) {
  return content.replace(regex, renderEmoji);
}
