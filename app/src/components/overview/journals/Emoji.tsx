import { IJournal } from "../../../serverApi/IJournal";
import { IconStyle } from "../../common/IconStyle";
import { getUiSettings } from "../../../util/journalUtils";
import { JournalTypeIcon } from "../../common/JournalTypeIcon";
import { useRef, useState } from "react";
import EmojiPicker, { Emoji, EmojiStyle } from "emoji-picker-react";
import { Popover } from "@mui/material";

const emojiStyle = EmojiStyle.NATIVE;

export const JournalIconWrapper: React.FC<{
  journal: IJournal;
  iconStyle: IconStyle;
}> = ({ journal, iconStyle }) => {
  const emoji = getUiSettings(journal).emoji?.unified;

  return emoji ? (
    <Emoji unified={emoji} size={25} emojiStyle={emojiStyle} />
  ) : (
    <JournalTypeIcon type={journal.type} style={iconStyle} />
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
          emojiStyle={emojiStyle}
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
