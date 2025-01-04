import {
  ExpandLess,
  ExpandMore,
  History,
  List as ListIcon,
  ListAlt,
  NotificationsNone,
  SearchOutlined,
  Shortcut,
  Star,
  Style,
} from "@mui/icons-material";
import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useJournalsQuery } from "../../../serverApi/reactQuery/queries/useJournalsQuery";
import { JournalIcon } from "../../overview/journals/JournalIcon";
import { IconStyle } from "../../common/IconStyle";
import { useRecentlyViewedJournals } from "./useRecentlyViewedJournals";
import { ActionIconButton } from "../../common/actions/ActionIconButton";
import { ActionFactory } from "../../common/actions/ActionFactory";
import { IJournal } from "../../../serverApi/IJournal";

export const AppMenu: React.FC<{ close: () => void }> = ({ close }) => {
  const [areFavoritesExpanded, setAreFavoritesExpanded] = useState(false);

  const favoriteJournals =
    useJournalsQuery(null, [], true, undefined, areFavoritesExpanded) ?? [];

  const [areRecentlyViewExpanded, setAreRecentlyViewExpanded] = useState(true);

  const { viewedJournals } = useRecentlyViewedJournals();

  return (
    <MenuContainer>
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
          targetUrl="/go-to"
          label="Go to"
          iconStart={<Shortcut sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/search"
          label="Search"
          iconStart={<SearchOutlined sx={{ color: "primary.main" }} />}
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
            {favoriteJournals
              .sort((a, b) => {
                const firstName = a.name?.toLowerCase();
                const secondName = b.name?.toLowerCase();

                return firstName < secondName
                  ? -1
                  : firstName > secondName
                    ? 1
                    : 0;
              })
              .map((journal) => (
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
    <ListItem onClick={onClick}>
      <ListItemButton sx={{ display: "flex" }}>
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
          {iconEnd ? (
            <ListItemIcon sx={{ minWidth: "40px", color: "initial" }}>
              {iconEnd}
            </ListItemIcon>
          ) : null}
        </LinkOrSpan>
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
  targetUrl: string;
  children: React.ReactNode;
}> = ({ targetUrl, children }) => {
  if (!targetUrl) {
    return <StyledSpan>{children}</StyledSpan>;
  }

  return (
    <StyledLink to={targetUrl} sx={{ flexGrow: 1, alignItems: "center" }}>
      {children}
    </StyledLink>
  );
};

const MenuContainer = styled("div")`
  min-width: 280px;
  padding: 0;

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
