import React, { useRef, useState } from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Popover, styled } from "@mui/material";

export const engravedEmojiStyle = EmojiStyle.NATIVE;

export const EmojiPickerWrapper: React.FC<{
  onEmojiClick: (emoji: string) => void;
  opener: React.ReactElement;
}> = ({ onEmojiClick, opener }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLElement>();

  return (
    <>
      <EmojiContainer onClick={() => setIsOpen(!isOpen)} ref={ref}>
        {opener}
      </EmojiContainer>
      <Popover
        open={isOpen}
        anchorEl={ref.current}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <EmojiPickerContainer>
          <EmojiPicker
            skinTonesDisabled={true}
            previewConfig={{ showPreview: false }}
            emojiStyle={engravedEmojiStyle}
            onEmojiClick={(e) => {
              onEmojiClick(e.unified);
              setIsOpen(false);
            }}
          />
        </EmojiPickerContainer>
      </Popover>
    </>
  );
};

const EmojiContainer = styled("span")`
  & > span {
    cursor: pointer;
    display: block !important;
    margin-right: ${(p) => p.theme.spacing(2)};
    line-height: 22px;
    font-family: "Segoe UI Emoji", "Segoe UI Symbol", "Segoe UI",
      "Apple Color Emoji", "Twemoji Mozilla", "Noto Color Emoji",
      "EmojiOne Color", "Android Emoji";
  }
`;

const EmojiPickerContainer = styled("div")`
  .epr-body * {
    font-family: Karla;
  }
`;
