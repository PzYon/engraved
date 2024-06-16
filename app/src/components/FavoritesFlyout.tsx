import { Star } from "@mui/icons-material";
import { Menu, MenuItem, styled } from "@mui/material";
import React, { useRef, useState } from "react";
import { useJournalsQuery } from "../serverApi/reactQuery/queries/useJournalsQuery";
import { Link } from "react-router-dom";
import { ActionIconButton } from "./common/actions/ActionIconButton";
import { ActionFactory } from "./common/actions/ActionFactory";
import { JournalIcon } from "./overview/journals/JournalIcon";
import { IconStyle } from "./common/IconStyle";

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
                to={`/journals/details/${journal.id}`}
                onClick={close}
                style={{ flexGrow: 1, paddingRight: 10 }}
              >
                <MenuItemContainer>
                  <JournalIcon journal={journal} iconStyle={IconStyle.Small} />
                  <span>{journal.name}</span>
                </MenuItemContainer>
              </Link>
              <ActionIconButton
                action={ActionFactory.addEntry(journal, true, false, close)}
              />
            </MenuItem>
          );
        })}
    </Menu>
  );
};

const MenuItemContainer = styled("div")`
  display: inline-flex;
  align-items: center;

  .ngrvd-icon {
    margin-right: ${(p) => p.theme.spacing(1)};
    padding-top: 4px;
  }
`;
