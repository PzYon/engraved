import React, { useRef, useState } from "react";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Popover, styled } from "@mui/material";

export const EmojiPickerWrapper: React.FC<{
  onEmojiClick: (emoji: string) => void;
  opener: React.ReactElement;
}> = ({ onEmojiClick, opener }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLElement>(undefined);

  return (
    <>
      <span onClick={() => setIsOpen(!isOpen)} ref={ref}>
        {opener}
      </span>
      <Popover
        open={isOpen}
        anchorEl={{
          getBoundingClientRect: () => ref.current.getBoundingClientRect(),
          nodeType: 1,
        }}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        disableScrollLock={true}
      >
        <EmojiPickerContainer>
          <EmojiPicker
            skinTonesDisabled={true}
            previewConfig={{ showPreview: false }}
            emojiStyle={EmojiStyle.NATIVE}
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

const EmojiPickerContainer = styled("div")`
  .epr-body * {
    font-family: ${(p) => p.theme.typography.fontFamily};
  }
`;
