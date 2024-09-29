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

export const ManageJournalUserTags: React.FC<{ journalId: string }> = ({
  journalId,
}) => {
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
              role={undefined}
              onClick={() => {
                const index = selectedTagNames.indexOf(tag);
                if (index === -1) {
                  selectedTagNames.push(tag);
                } else {
                  selectedTagNames.splice(index, 1);
                }
                setSelectedTagNames([...selectedTagNames]);
              }}
              dense
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={selectedTagNames.includes(tag)}
                  tabIndex={-1}
                  disableRipple
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
