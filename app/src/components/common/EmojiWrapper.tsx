import { Emoji } from "emoji-picker-react";
import { IconStyle } from "./IconStyle";
import { engravedEmojiStyle } from "./EmojiPickerWrapper";

export const EmojiWrapper: React.FC<{
  emoji: string;
  style: IconStyle;
}> = ({ emoji, style }) => {
  return (
    <Emoji
      unified={emoji}
      size={style === IconStyle.Large ? 26 : 22}
      emojiStyle={engravedEmojiStyle}
    />
  );
};
