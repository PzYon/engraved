import React from "react";
import { List, ListItem, ListItemText } from "@mui/material";
import { JournalAppMenuItem, MenuHost } from "./AppMenu";
import { useRecentlyViewedJournals } from "./useRecentlyViewedJournals";

export const RecentlyViewedMenu: React.FC<{ close: () => void }> = ({
  close,
}) => {
  const viewedJournals = useRecentlyViewedJournals();

  return (
    <MenuHost>
      <List dense>
        {viewedJournals.length ? (
          // the most recent journal goes last, as that is closest to the launcher
          viewedJournals
            .toReversed()
            .map((journal) => (
              <JournalAppMenuItem
                key={journal.id}
                journal={journal}
                close={close}
              />
            ))
        ) : (
          <ListItem sx={{ px: 2 }}>
            <ListItemText secondary="No journals viewed yet." />
          </ListItem>
        )}
      </List>
    </MenuHost>
  );
};
