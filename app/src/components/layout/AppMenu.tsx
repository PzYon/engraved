import {
  List as ListIcon,
  ListAlt,
  NotificationsNone,
  SearchOutlined,
  Style,
} from "@mui/icons-material";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

export const AppMenu: React.FC<{ close: () => void }> = ({ close }) => {
  return (
    <MenuContainer>
      <List>
        <AppMenuItem
          targetUrl="/tags"
          label="Tags"
          icon={<Style sx={{ color: "primary.main" }} />}
          close={close}
        />
        <AppMenuItem
          targetUrl="/journals"
          label="Journals"
          icon={<ListAlt sx={{ color: "primary.main" }} />}
          close={close}
        />
        <AppMenuItem
          targetUrl="/entries"
          label="Entries"
          icon={<ListIcon sx={{ color: "primary.main" }} />}
          close={close}
        />
        <AppMenuItem
          targetUrl="/scheduled"
          label="Scheduled"
          icon={<NotificationsNone sx={{ color: "primary.main" }} />}
          close={close}
        />
        <AppMenuItem
          targetUrl="/search"
          label="Search"
          icon={<SearchOutlined sx={{ color: "primary.main" }} />}
          close={close}
        />
      </List>
    </MenuContainer>
  );
};

const AppMenuItem: React.FC<{
  targetUrl: string;
  label: string;
  icon: React.ReactNode;
  close: () => void;
}> = ({ targetUrl, label, icon, close }) => {
  return (
    <ListItem onClick={close}>
      <ListItemButton>
        <StyledLink to={targetUrl}>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText>{label}</ListItemText>
        </StyledLink>
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
