import React, { useRef, useState } from "react";
import EmojiPicker, { Emoji, EmojiStyle } from "emoji-picker-react";
import { Popover } from "@mui/material";
import { IconStyle } from "./IconStyle";

const emojiStyle = EmojiStyle.NATIVE;

export const EmojiPickerWrapper: React.FC<{
  onEmojiClick: (emoji: string) => void;
  opener: React.ReactElement;
}> = ({ onEmojiClick, opener }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLElement>();

  return (
    <>
      <span
        onClick={() => setIsOpen(!isOpen)}
        style={{ cursor: "pointer" }}
        ref={ref}
      >
        {opener}
      </span>
      <Popover
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <EmojiPicker
          emojiStyle={emojiStyle}
          onEmojiClick={(e) => {
            onEmojiClick(e.unified);
            setIsOpen(false);
          }}
          previewConfig={{
            showPreview: false,
          }}
          skinTonesDisabled={true}
        />
      </Popover>
    </>
  );
};

export const EmojiWrapper: React.FC<{
  emoji: string;
  style: IconStyle;
}> = ({ emoji, style }) => {
  return (
    <span
      style={style === IconStyle.Large ? { marginRight: "16px" } : undefined}
    >
      <Emoji
        unified={emoji}
        size={style === IconStyle.Large ? 24 : 20}
        emojiStyle={emojiStyle}
      />
    </span>
  );
};
