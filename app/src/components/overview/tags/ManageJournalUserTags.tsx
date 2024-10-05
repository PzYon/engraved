import {
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useAppContext } from "../../../AppContext";
import React, { useState } from "react";

export const ManageJournalUserTags: React.FC<{
  journalId: string;
  onChangedTags: (tagIds: string[]) => void;
}> = ({ journalId, onChangedTags }) => {
  const { user } = useAppContext();

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(() =>
    user.tags
      .filter((tag) => tag.journalIds.includes(journalId))
      .map((t) => t.id),
  );

  return (
    <List sx={{ width: "100%" }}>
      {user.tags.map((tag) => {
        return (
          <ListItem key={tag.id} disablePadding>
            <ListItemButton
              dense
              onClick={() => {
                const index = selectedTagIds.indexOf(tag.id);
                if (index === -1) {
                  selectedTagIds.push(tag.id);
                } else {
                  selectedTagIds.splice(index, 1);
                }

                const changedTagIds = [...selectedTagIds];
                setSelectedTagIds(changedTagIds);
                onChangedTags(changedTagIds);
              }}
            >
              <ListItemIcon sx={{ minWidth: 0 }}>
                <Checkbox
                  edge="start"
                  checked={selectedTagIds.includes(tag.id)}
                  tabIndex={-1}
                  disableRipple
                  sx={{ p: 1, pl: 0 }}
                />
              </ListItemIcon>
              <ListItemText primary={tag.label} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
