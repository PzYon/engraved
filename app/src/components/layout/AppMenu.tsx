import { List, ListItem, ListItemText } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const AppMenu: React.FC<{ close: () => void }> = ({ close }) => {
  return (
    <List>
      <ListItem onClick={close}>
        <ListItemText>
          <Link to="/tags">Tags</Link>
        </ListItemText>
      </ListItem>
      <ListItem onClick={close}>
        <ListItemText>
          <Link to="/journals">Journal</Link>
        </ListItemText>
      </ListItem>
      <ListItem onClick={close}>
        <ListItemText>
          <Link to="/entries">Entries</Link>
        </ListItemText>
      </ListItem>
      <ListItem onClick={close}>
        <ListItemText>
          <Link to="/scheduled">Scheduled</Link>
        </ListItemText>
      </ListItem>
    </List>
  );
};
