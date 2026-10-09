import React, { useRef, useState } from "react";
import { Popover, styled } from "@mui/material";
import { LazyLoadSuspender } from "./LazyLoadSuspender";

// The picker brings its complete emoji data along, which made up about a fifth
// of the JavaScript loaded at startup - for something that is only needed when
// the icon of a journal is changed.
const LazyEmojiPicker = React.lazy(() => import("./LazyEmojiPicker"));

const pickerWidth = 350;
const pickerHeight = 450;

export const EmojiPickerWrapper: React.FC<{
  onEmojiClick: (emoji: string) => void;
  opener: React.ReactElement;
}> = ({ onEmojiClick, opener }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  return (
    <>
      <span onClick={() => setIsOpen(!isOpen)} ref={ref}>
        {opener}
      </span>
      <Popover
        open={isOpen}
        anchorEl={{
          getBoundingClientRect: () => ref.current!.getBoundingClientRect(),
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
          <LazyLoadSuspender>
            <LazyEmojiPicker
              width={pickerWidth}
              height={pickerHeight}
              onEmojiClick={(emoji) => {
                onEmojiClick(emoji);
                setIsOpen(false);
              }}
            />
          </LazyLoadSuspender>
        </EmojiPickerContainer>
      </Popover>
    </>
  );
};

// Reserves the room the picker needs from the start: the popover positions
// itself once, when it opens, which is before the picker has been loaded.
const EmojiPickerContainer = styled("div")`
  min-width: ${pickerWidth}px;
  min-height: ${pickerHeight}px;

  .epr-body * {
    font-family: ${(p) => p.theme.typography.fontFamily};
  }
`;
