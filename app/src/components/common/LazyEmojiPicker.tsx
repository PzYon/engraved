import React from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";

const LazyEmojiPicker: React.FC<{
  onEmojiClick: (emoji: string) => void;
  width: number;
  height: number;
}> = ({ onEmojiClick, width, height }) => {
  return (
    <EmojiPicker
      width={width}
      height={height}
      skinTonesDisabled={true}
      previewConfig={{ showPreview: false }}
      emojiStyle={EmojiStyle.NATIVE}
      onEmojiClick={(e) => onEmojiClick(e.unified)}
    />
  );
};

export default LazyEmojiPicker;
