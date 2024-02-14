import React from "react";
import { JournalType } from "../serverApi/JournalType";
import { JournalTypeIcon } from "./common/JournalTypeIcon";
import { styled } from "@mui/material";
import { IconStyle } from "./common/IconStyle";

export const JournalMenuItem: React.FC<{
  journalType: JournalType;
  label: string;
}> = ({ journalType, label }) => {
  return (
    <MenuItemContainer>
      <JournalTypeIcon type={journalType} style={IconStyle.Overview} />
      {label}
    </MenuItemContainer>
  );
};

const MenuItemContainer = styled("div")`
  display: inline-flex;
  align-items: center;

  .ngrvd-icon {
    margin-right: ${(p) => p.theme.spacing(1)};
  }
`;
