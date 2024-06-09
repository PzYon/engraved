import React, { useRef, useState } from "react";
import { IJournal } from "../../serverApi/IJournal";
import { PageTitle } from "../layout/pages/PageTitle";
import { JournalTypeIcon } from "../common/JournalTypeIcon";
import { IconStyle } from "../common/IconStyle";
import EmojiPicker, { Emoji, EmojiStyle } from "emoji-picker-react";
import { Popover } from "@mui/material";

export const JournalPageTitle: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const [emoji, setEmoji] = useState<string>(undefined);

  if (!journal) {
    return null;
  }

  return (
    <PageTitle
      icon={
        <EmojiPickerWrapper
          onEmojiClick={setEmoji}
          opener={
            emoji ? (
              <Emoji unified={emoji} size={25} emojiStyle={EmojiStyle.NATIVE} />
            ) : (
              <JournalTypeIcon
                type={journal?.type}
                style={IconStyle.PageTitle}
              />
            )
          }
        />
      }
      title={journal?.name}
    />
  );
};

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
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <EmojiPicker
          emojiStyle={EmojiStyle.NATIVE}
          onEmojiClick={(e) => {
            onEmojiClick(e.unified);
            setIsOpen(false);
          }}
          previewConfig={{
            showPreview: false,
          }}
          skinTonesDisabled={true}
          style={{
            fontFamily: "Karla", // engravedTheme.typography.fontFamily,
          }}
        />
      </Popover>
    </>
  );
};
