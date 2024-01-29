import { Star } from "@mui/icons-material";
import { List, ListItemText, Popover } from "@mui/material";
import React, { useRef, useState } from "react";
import { useJournalsQuery } from "../serverApi/reactQuery/queries/useJournalsQuery";
import { JournalMenuItem } from "./JournalMenuItem";
import { Link } from "react-router-dom";
import { ActionIconButton } from "./common/actions/ActionIconButton";

export const FavoritesFlyout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const anchorElement = useRef(null);

  return (
    <>
      <ActionIconButton
        action={{
          icon: (
            <Star
              fontSize="small"
              sx={{ color: "common.white" }}
              ref={anchorElement}
            />
          ),
          onClick: () => setIsOpen(!isOpen),
          label: "Favorites",
          key: "favorites",
        }}
      ></ActionIconButton>
      <Popover
        open={isOpen}
        anchorEl={anchorElement.current}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <FavoritesList close={() => setIsOpen(false)} />
      </Popover>
    </>
  );
};

const FavoritesList: React.FC<{ close: () => void }> = ({ close }) => {
  const journals = useJournalsQuery(null, [], true);

  if (!journals?.length) {
    return null;
  }

  return (
    <List sx={{ p: 1 }}>
      {journals.map((journal) => {
        return (
          <ListItemText sx={{ p: 1 }} key={journal.id}>
            <Link to={`/journals/${journal.id}`} onClick={close}>
              <JournalMenuItem
                journalType={journal.type}
                label={journal.name}
              />
            </Link>
          </ListItemText>
        );
      })}
    </List>
  );
};
