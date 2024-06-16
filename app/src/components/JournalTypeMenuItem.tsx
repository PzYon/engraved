import React from "react";
import { JournalType } from "../serverApi/JournalType";
import { styled } from "@mui/material";
import { IconStyle } from "./common/IconStyle";
import { JournalTypeIcon } from "./common/JournalTypeIcon";

export const JournalTypeMenuItem: React.FC<{
  journalType: JournalType;
  label: string;
}> = ({ journalType, label }) => {
  return (
    <MenuItemContainer>
      <JournalTypeIcon type={journalType} style={IconStyle.Small} />
      <span>{label}</span>
    </MenuItemContainer>
  );
};

const MenuItemContainer = styled("div")`
  display: inline-flex;
  align-items: center;

  .ngrvd-icon {
    margin-right: ${(p) => p.theme.spacing(1)};
    padding-top: 4px;
  }
`;
