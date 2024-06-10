import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { IconStyle } from "../../common/IconStyle";
import { getUiSettings } from "../../../util/journalUtils";
import { JournalTypeIcon } from "../../common/JournalTypeIcon";
import { EmojiWrapper } from "../../common/Emoji";

export const JournalIconWrapper: React.FC<{
  journal: IJournal;
  iconStyle: IconStyle;
}> = ({ journal, iconStyle }) => {
  const emoji = getUiSettings(journal).emoji?.unified;

  if (emoji) {
    return <EmojiWrapper emoji={emoji} style={iconStyle} />;
  }

  return <JournalTypeIcon type={journal.type} style={iconStyle} />;
};
