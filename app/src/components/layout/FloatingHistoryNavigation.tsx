import React, { useRef } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Popover, styled } from "@mui/material";
import { JournalGoToItemRow } from "../overview/goto/GoTo";
import { useRecentlyViewedJournals } from "./menu/useRecentlyViewedJournals";
import { ActionIconButton } from "../common/actions/ActionIconButton";
import { HistoryOutlined } from "@mui/icons-material";

export const FloatingHistoryNavigation: React.FC = () => {
  const domElementRef = useRef<HTMLDivElement>(undefined);

  const [showMenu, setShowMenu] = React.useState(false);

  const recentlyViewedJournals = useRecentlyViewedJournals();

  return (
    <Host>
      <div
        ref={domElementRef}
        onClick={() => setShowMenu(!showMenu)}
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <ActionIconButton
          action={{
            sx: { backgroundColor: "primary.main", color: "common.white" },
            key: "history",
            label: "Recently viewed journals",
            icon: <HistoryOutlined />,
          }}
        />
      </div>

      {showMenu ? (
        <Popover
          open={true}
          onClose={() => setShowMenu(false)}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <List>
            {recentlyViewedJournals.map((journal) => {
              return (
                <ListItem key={journal.id}>
                  <JournalGoToItemRow journal={journal} hasFocus={false} />
                </ListItem>
              );
            })}
          </List>
        </Popover>
      ) : null}
    </Host>
  );
};

const Host = styled("div")`
  position: sticky;
  bottom: 10px;
  background-color: deeppink;
`;
