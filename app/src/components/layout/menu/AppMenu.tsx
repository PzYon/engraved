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
          targetUrl="/go-to"
          label="Go to"
          icon={<Shortcut sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/tags"
          label="Tags"
          icon={<Style sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/journals"
          label="Journals"
          icon={<ListAlt sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/entries"
          label="Entries"
          icon={<ListIcon sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/scheduled"
          label="Scheduled"
          icon={<NotificationsNone sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          targetUrl="/search"
          label="Search"
          icon={<SearchOutlined sx={{ color: "primary.main" }} />}
          onClick={close}
        />
        <AppMenuItem
          label="Favorites"
          icon={<Star sx={{ color: "primary.main" }} />}
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
              .map((journal) => {
                return (
                  <AppMenuItem
                    key={journal.id}
                    targetUrl={`/journals/details/${journal.id}`}
                    label={journal.name}
                    icon={
                      <JournalIcon
                        journal={journal}
                        iconStyle={IconStyle.Small}
                      />
                    }
                    onClick={close}
                  />
                );
              })}
          </List>
        </Collapse>
        <AppMenuItem
          label="Recently viewed"
          icon={<History sx={{ color: "primary.main" }} />}
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
            {viewedJournals.map((journal) => {
              return (
                <AppMenuItem
                  key={journal.id}
                  targetUrl={`/journals/details/${journal.id}`}
                  label={journal.name}
                  icon={
                    <JournalIcon
                      journal={journal}
                      iconStyle={IconStyle.Small}
                    />
                  }
                  onClick={close}
                />
              );
            })}
          </List>
        </Collapse>
      </List>
    </MenuContainer>
  );
};

const AppMenuItem: React.FC<{
  targetUrl?: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  suffix?: React.ReactNode;
}> = ({ targetUrl, label, icon, onClick, suffix }) => {
  return (
    <ListItem onClick={onClick}>
      <ListItemButton sx={{ display: "flex" }}>
        <LinkOrSpan targetUrl={targetUrl}>
          <ListItemIcon sx={{ minWidth: "40px", color: "initial" }}>
            {icon}
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
        {suffix}
      </ListItemButton>
    </ListItem>
  );
};

export const LinkOrSpan: React.FC<{
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
        padding: 8px 4px 4px 24px;
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
