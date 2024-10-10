import {
  ExpandLess,
  ExpandMore,
  List as ListIcon,
  ListAlt,
  NotificationsNone,
  SearchOutlined,
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
import { useJournalsQuery } from "../../serverApi/reactQuery/queries/useJournalsQuery";
import { JournalIcon } from "../overview/journals/JournalIcon";
import { IconStyle } from "../common/IconStyle";

export const AppMenu: React.FC<{ close: () => void }> = ({ close }) => {
  const [areFavoritesExpanded, setAreFavoritesExpanded] = useState(false);

  const journals =
    useJournalsQuery(null, [], true, undefined, areFavoritesExpanded) ?? [];

  return (
    <MenuContainer>
      <List>
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
          targetUrl=""
          label="Favorites"
          icon={<Star sx={{ color: "primary.main" }} />}
          onClick={() => setAreFavoritesExpanded(!areFavoritesExpanded)}
          suffix={areFavoritesExpanded ? <ExpandLess /> : <ExpandMore />}
        />
        <Collapse in={areFavoritesExpanded} timeout="auto" unmountOnExit>
          <List disablePadding dense>
            {journals
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
      </List>
    </MenuContainer>
  );
};

/*
 <MenuItem key={journal.id} sx={{ display: "flex" }}>
                    <Link
                      to={`/journals/details/${journal.id}`}
                      onClick={close}
                      style={{ flexGrow: 1, paddingRight: 10 }}
                    >
                      <JournalMenuItem journal={journal} />
                    </Link>
                    <ActionIconButton
                      action={ActionFactory.addEntry(journal, false, close, true)}
                    />
                  </MenuItem>
 */

const AppMenuItem: React.FC<{
  targetUrl: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  suffix?: React.ReactNode;
}> = ({ targetUrl, label, icon, onClick, suffix }) => {
  return (
    <ListItem onClick={onClick}>
      <ListItemButton>
        <StyledLink to={targetUrl}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </StyledLink>
        {suffix}
      </ListItemButton>
    </ListItem>
  );
};

const MenuContainer = styled("div")`
  padding: 16px 32px 16px 16px;
`;

const StyledLink = styled(Link)`
  display: flex;
`;
