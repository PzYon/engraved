import React from "react";
import { JournalType } from "../../serverApi/JournalType";
import { JournalTypeFactory } from "../../journalTypes/JournalTypeFactory";
import { Icon, IconStyle } from "./Icon";

export const JournalTypeIcon: React.FC<{
  type: JournalType;
  style: IconStyle;
}> = ({ type, style }) => (
  <Icon style={style}>{JournalTypeFactory.create(type).getIcon()}</Icon>
);
