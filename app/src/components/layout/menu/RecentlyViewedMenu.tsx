import React from "react";
import { CircularProgress, List, ListItem, ListItemText } from "@mui/material";
import { JournalAppMenuItem, MenuHost } from "./AppMenu";
import { useRecentlyViewedJournals } from "./useRecentlyViewedJournals";
import { useMatchRoute } from "@tanstack/react-router";

export const RecentlyViewedMenu: React.FC<{ close: () => void }> = ({
  close,
}) => {
  const matchRoute = useMatchRoute();
  const currentJournalRoute = matchRoute({
    to: "/journals/details/$journalId",
    fuzzy: true,
  });
  const currentJournalId = currentJournalRoute
    ? currentJournalRoute.journalId
    : undefined;

  const { journals, isLoading } = useRecentlyViewedJournals();
  const viewedJournals = journals.filter((j) => j.id !== currentJournalId);

  return (
    <MenuHost>
      <List dense>
        {isLoading ? (
          <ListItem sx={{ justifyContent: "center" }}>
            <CircularProgress size="20px" aria-label="Loading" />
          </ListItem>
        ) : viewedJournals.length ? (
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
            <ListItemText
              secondary={
                currentJournalId
                  ? "No other journals viewed yet."
                  : "No journals viewed yet."
              }
            />
          </ListItem>
        )}
      </List>
    </MenuHost>
  );
};
