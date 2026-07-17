import React from "react";
import { JournalType } from "../../serverApi/JournalType";
import { journalTypeIcons } from "../../journalTypes/journalTypeIcons";
import { Icon } from "./Icon";
import { IconStyle } from "./IconStyle";

export const JournalTypeIcon: React.FC<{
  type: JournalType;
  style: IconStyle;
  isClickable?: boolean;
}> = ({ type, style, isClickable }) => (
  <Icon style={style} isClickable={isClickable}>
    {journalTypeIcons[type]}
  </Icon>
);
