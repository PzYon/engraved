import { IJournal } from "../serverApi/IJournal";
import { JournalIcon } from "./overview/journals/JournalIcon";
import { IconStyle } from "./common/IconStyle";
import { styled } from "@mui/material";

export const JournalMenuItem: React.FC<{ journal: IJournal }> = ({
  journal,
}) => {
  return (
    <MenuItemContainer>
      <JournalIcon journal={journal} iconStyle={IconStyle.Small} />
      <span>{journal.name}</span>
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
