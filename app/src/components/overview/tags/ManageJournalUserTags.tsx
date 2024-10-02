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
  onChangedTags: (tagNames: string[]) => void;
}> = ({ journalId, onChangedTags }) => {
  const { user } = useAppContext();
  const allTagNames = Object.keys(user.tags);

  const [selectedTagNames, setSelectedTagNames] = useState<string[]>(() =>
    allTagNames.filter((tag) => user.tags[tag].includes(journalId)),
  );

  return (
    <List sx={{ width: "100%" }}>
      {allTagNames.map((tag) => {
        return (
          <ListItem key={tag} disablePadding>
            <ListItemButton
              dense
              onClick={() => {
                const index = selectedTagNames.indexOf(tag);
                if (index === -1) {
                  selectedTagNames.push(tag);
                } else {
                  selectedTagNames.splice(index, 1);
                }

                const changedTagNames = [...selectedTagNames];
                setSelectedTagNames(changedTagNames);
                onChangedTags(changedTagNames);
              }}
            >
              <ListItemIcon sx={{ minWidth: 0 }}>
                <Checkbox
                  edge="start"
                  checked={selectedTagNames.includes(tag)}
                  tabIndex={-1}
                  disableRipple
                  sx={{ p: 1, pl: 0 }}
                />
              </ListItemIcon>
              <ListItemText primary={tag} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};
