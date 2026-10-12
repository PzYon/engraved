import Assignment from "@mui/icons-material/Assignment";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import History from "@mui/icons-material/History";
import ListIcon from "@mui/icons-material/List";
import ListAlt from "@mui/icons-material/ListAlt";
import NotificationsNone from "@mui/icons-material/NotificationsNone";
import PlaylistAddOutlined from "@mui/icons-material/PlaylistAddOutlined";
import SearchOutlined from "@mui/icons-material/SearchOutlined";
import Shortcut from "@mui/icons-material/Shortcut";
import Star from "@mui/icons-material/Star";
import Style from "@mui/icons-material/Style";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useJournalsQuery } from "../../../serverApi/reactQuery/queries/useJournalsQuery";
import { JournalIcon } from "../../overview/journals/JournalIcon";
import { IconStyle } from "../../common/IconStyle";
import { useRecentlyViewedJournals } from "./useRecentlyViewedJournals";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IJournal } from "../../../serverApi/IJournal";
import { sortJournalsByName } from "../../../util/journalUtils";
import { translations } from "../../../i18n/translations";

export const AppMenu: React.FC<{ close: () => void }> = ({ close }) => {
  const [areFavoritesExpanded, setAreFavoritesExpanded] = useState(false);

  const favoriteJournals =
    useJournalsQuery(undefined, [], true, undefined, areFavoritesExpanded) ??
    [];

  const [areRecentlyViewExpanded, setAreRecentlyViewExpanded] = useState(false);

  const viewedJournals = useRecentlyViewedJournals();

  const menuRef = useRef<HTMLDivElement>(null);

  // focusing the container (instead of an item) keeps the drawer's focus trap
  // from moving the focus out of reach of the arrow key handler below
  useEffect(() => {
    menuRef.current?.focus();
  }, []);

  return (
    <MenuContainer
      ref={menuRef}
      tabIndex={-1}
      onKeyDown={(e) => moveFocusOnArrowKey(e, menuRef.current)}
    >
      <List>
        <AppMenuItem
          targetUrl="/tags"
          label="Tags"
          iconStart={<Style sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/journals"
          label="Journals"
          iconStart={<ListAlt sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/entries"
          label="Entries"
          iconStart={<ListIcon sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/scheduled"
          label="Scheduled"
          iconStart={<NotificationsNone sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <Spacer />
        <AppMenuItem
          targetUrl="/search"
          label="Search"
          iconStart={<SearchOutlined sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/go-to"
          label="Go to"
          iconStart={<Shortcut sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <Spacer />
        <AppMenuItem
          targetUrl="/quick-add"
          label="Quick Add"
          iconStart={<PlaylistAddOutlined sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/scratchpad"
          label={translations.scratchpad_title}
          iconStart={<Assignment sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <Spacer />
        <AppMenuItem
          label="Favorites"
          iconStart={<Star sx={{ color: "primary.main" }} />}
          onClick={() => setAreFavoritesExpanded(!areFavoritesExpanded)}
          suffix={
            areFavoritesExpanded ? (
              <ExpandLess sx={{ color: "primary.main" }} />
            ) : (
              <ExpandMore sx={{ color: "primary.main" }} />
            )
          }
        />
        <Collapse in={areFavoritesExpanded} timeout="auto" unmountOnExit>
          <List disablePadding dense>
            {sortJournalsByName(favoriteJournals).map((journal) => (
              <JournalAppMenuItem
                key={journal.id}
                journal={journal}
                close={close}
              />
            ))}
          </List>
        </Collapse>
        <AppMenuItem
          label="Recently viewed"
          iconStart={<History sx={{ color: "primary.main" }} />}
          onClick={() => setAreRecentlyViewExpanded(!areRecentlyViewExpanded)}
          suffix={
            areRecentlyViewExpanded ? (
              <ExpandLess sx={{ color: "primary.main" }} />
            ) : (
              <ExpandMore sx={{ color: "primary.main" }} />
            )
          }
        />
        <Collapse in={areRecentlyViewExpanded} timeout="auto" unmountOnExit>
          <List disablePadding dense>
            {viewedJournals.map((journal) => (
              <JournalAppMenuItem
                key={journal.id}
                journal={journal}
                close={close}
              />
            ))}
          </List>
        </Collapse>
      </List>
    </MenuContainer>
  );
};

const AppMenuItem: React.FC<{
  targetUrl?: string;
  label: React.ReactNode;
  iconStart: React.ReactNode;
  iconEnd?: React.ReactNode;
  onClick: () => void;
  suffix?: React.ReactNode;
}> = ({ targetUrl, label, iconStart, iconEnd, onClick, suffix }) => {
  return (
    <ListItem>
      <ListItemButton
        onClick={onClick}
        sx={{ display: "flex" }}
        tabIndex={targetUrl ? -1 : 0}
        {...(targetUrl ? {} : menuItemAttribute)}
      >
        <LinkOrSpan targetUrl={targetUrl}>
          <ListItemIcon sx={{ minWidth: "40px", color: "initial" }}>
            {iconStart}
          </ListItemIcon>
          <ListItemText
            sx={{
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
              pr: 2,
            }}
          >
            {label}
          </ListItemText>
        </LinkOrSpan>
        {iconEnd ? (
          <ListItemIcon sx={{ minWidth: "40px", color: "initial" }}>
            {iconEnd}
          </ListItemIcon>
        ) : null}
        {suffix}
      </ListItemButton>
    </ListItem>
  );
};

const JournalAppMenuItem: React.FC<{
  journal: IJournal;
  close: () => void;
}> = ({ journal, close }) => {
  return (
    <AppMenuItem
      key={journal.id}
      targetUrl={`/journals/details/${journal.id}`}
      label={
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ flexGrow: 1 }}>{journal.name}</div>
        </div>
      }
      iconStart={<JournalIcon journal={journal} iconStyle={IconStyle.Small} />}
      iconEnd={
        <ActionIconButton
          action={ActionFactory.addEntry(journal, false, close, true)}
        />
      }
      onClick={close}
    />
  );
};

const LinkOrSpan: React.FC<{
  targetUrl: string | undefined;
  children: React.ReactNode;
}> = ({ targetUrl, children }) => {
  if (!targetUrl) {
    return <StyledSpan>{children}</StyledSpan>;
  }

  return (
    <StyledLink
      {...menuItemAttribute}
      to={targetUrl}
      sx={{ flexGrow: 1, alignItems: "center", alignSelf: "stretch" }}
    >
      {children}
    </StyledLink>
  );
};

const menuItemAttribute = { "data-app-menu-item": true };

function getMenuItems(menu: HTMLElement | null): HTMLElement[] {
  return Array.from(
    menu?.querySelectorAll<HTMLElement>("[data-app-menu-item]") ?? [],
  );
}

function moveFocusOnArrowKey(e: React.KeyboardEvent, menu: HTMLElement | null) {
  if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
    return;
  }

  // keeps global arrow key handlers (e.g. of overview lists behind the menu) from reacting as well
  e.stopPropagation();
  e.preventDefault();

  const items = getMenuItems(menu);
  const currentIndex = items.indexOf(document.activeElement as HTMLElement);
  const lastIndex = items.length - 1;

  const nextIndex =
    e.key === "ArrowDown"
      ? currentIndex < lastIndex
        ? currentIndex + 1
        : 0
      : currentIndex > 0
        ? currentIndex - 1
        : lastIndex;

  items[nextIndex]?.focus();
}

const MenuContainer = styled("div")`
  min-width: 280px;
  padding: 0;
  outline: none;

  [data-app-menu-item]:focus-visible {
    outline: none;
  }

  .MuiListItemButton-root:has([data-app-menu-item]:focus-visible),
  .MuiListItemButton-root[data-app-menu-item]:focus-visible {
    outline: 2px solid ${(p) => p.theme.palette.primary.main};
    outline-offset: -2px;
  }

  li {
    padding: 0;
  }

  ul {
    ul {
      li > div {
        padding: 8px 4px 4px 40px;
      }
    }
  }
`;

const StyledLink = styled(Link)`
  display: flex;
`;

const StyledSpan = styled("span")`
  display: flex;
  flex-grow: 1;
  align-items: center;
  color: ${(p) => p.theme.palette.primary.main};
`;

const Spacer: React.FC = () => {
  return (
    <SpacerHost>
      <SpacerLine />
    </SpacerHost>
  );
};

const SpacerHost = styled("div")`
  padding: 15px;
`;

const SpacerLine = styled("div")`
  height: 1px;
  background-color: ${(p) => p.theme.palette.background.default};
`;
