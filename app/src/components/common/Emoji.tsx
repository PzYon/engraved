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
        style={{
          cursor: "pointer",
          backgroundColor: "deeppink",
          display: "block",
          lineHeight: 0,
          alignItems: "center",
          alignSelf: "center",
          justifySelf: "center",
          letterSpacing: "normal",
          marginRight: "16px",
          position: "relative",
          textAlign: "center",
          width: "26",
        }}
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
          skinTonesDisabled={true}
          previewConfig={{ showPreview: false }}
          emojiStyle={emojiStyle}
          onEmojiClick={(e) => {
            onEmojiClick(e.unified);
            setIsOpen(false);
          }}
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
    <Emoji
      unified={emoji}
      size={style === IconStyle.Large ? 26 : 20}
      emojiStyle={emojiStyle}
    />
  );
};
