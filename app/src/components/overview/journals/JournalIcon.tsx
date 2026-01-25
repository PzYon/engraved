import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { IconStyle } from "../../common/IconStyle";
import { getUiSettings } from "../../../util/journalUtils";
import { JournalTypeIcon } from "../../common/JournalTypeIcon";
import { EngravedEmoji } from "../../common/EngravedEmoji";

export const JournalIcon: React.FC<{
  journal: IJournal;
  iconStyle: IconStyle;
  isClickable?: boolean;
}> = ({ journal, iconStyle, isClickable }) => {
  const emoji = getUiSettings(journal).emoji?.unified;

  return emoji ? (
    <EngravedEmoji emoji={emoji} style={iconStyle} isClickable={isClickable} />
  ) : (
    <JournalTypeIcon
      type={journal.type}
      style={iconStyle}
      isClickable={isClickable}
    />
  );
};
