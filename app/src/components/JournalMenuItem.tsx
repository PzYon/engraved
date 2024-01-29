import React from "react";
import { JournalType } from "../serverApi/JournalType";
import { JournalTypeIcon } from "./common/JournalTypeIcon";
import { IconStyle } from "./common/Icon";
import { styled } from "@mui/material";

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
