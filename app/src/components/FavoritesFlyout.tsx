import { Star } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import React, { useRef, useState } from "react";
import { useJournalsQuery } from "../serverApi/reactQuery/queries/useJournalsQuery";
import { Link } from "react-router-dom";
import { ActionIconButton } from "./common/actions/ActionIconButton";
import { JournalMenuItem } from "./JournalMenuItem";

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
      {isOpen ? (
        <FavoritesList
          anchorElement={anchorElement.current}
          close={() => setIsOpen(false)}
        />
      ) : null}
    </>
  );
};

const FavoritesList: React.FC<{
  close: () => void;
  anchorElement: Element;
}> = ({ close, anchorElement }) => {
  const journals = useJournalsQuery(null, [], true);

  if (!journals?.length) {
    return null;
  }

  return (
    <Menu anchorEl={anchorElement} open={true} onClose={close}>
      {journals.map((journal) => {
        return (
          <MenuItem key={journal.id}>
            <Link to={`/journals/${journal.id}`} onClick={close}>
              <JournalMenuItem
                journalType={journal.type}
                label={journal.name}
              />
            </Link>
          </MenuItem>
        );
      })}
    </Menu>
  );
};
