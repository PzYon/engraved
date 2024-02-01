import { Star } from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";
import React, { useRef, useState } from "react";
import { useJournalsQuery } from "../serverApi/reactQuery/queries/useJournalsQuery";
import { Link } from "react-router-dom";
import { ActionIconButton } from "./common/actions/ActionIconButton";
import { JournalMenuItem } from "./JournalMenuItem";
import { ActionFactory } from "./common/actions/ActionFactory";
import { useDialogContext } from "./layout/dialogs/DialogContext";

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
  const { renderDialog } = useDialogContext();

  if (!journals?.length) {
    return null;
  }

  return (
    <Menu anchorEl={anchorElement} open={true} onClose={close}>
      {journals
        .sort((a, b) => {
          const firstName = a.name?.toLowerCase();
          const secondName = b.name?.toLowerCase();

          return firstName < secondName ? -1 : firstName > secondName ? 1 : 0;
        })
        .map((journal) => {
          return (
            <MenuItem key={journal.id} sx={{ display: "flex" }}>
              <Link
                to={`/journals/${journal.id}`}
                onClick={close}
                style={{ flexGrow: 1, paddingRight: 10 }}
              >
                <JournalMenuItem
                  journalType={journal.type}
                  label={journal.name}
                />
              </Link>
              <ActionIconButton
                action={ActionFactory.addEntry(journal, renderDialog, false)}
              />
            </MenuItem>
          );
        })}
    </Menu>
  );
};
