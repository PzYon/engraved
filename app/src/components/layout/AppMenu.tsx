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
        <ListItem onClick={close}>
          <ListItemText>
            <StyledLink to="/tags">
              <ListItemIcon>
                <Style sx={{ color: "primary.main" }} />
              </ListItemIcon>
              Tags
            </StyledLink>
          </ListItemText>
        </ListItem>
        <ListItem onClick={close}>
          <ListItemText>
            <StyledLink to="/journals">
              <ListItemIcon>
                <ListAlt sx={{ color: "primary.main" }} />
              </ListItemIcon>
              Journals
            </StyledLink>
          </ListItemText>
        </ListItem>
        <ListItem onClick={close}>
          <ListItemText>
            <StyledLink to="/entries">
              <ListItemIcon>
                <ListIcon sx={{ color: "primary.main" }} />
              </ListItemIcon>
              Entries
            </StyledLink>
          </ListItemText>
        </ListItem>
        <ListItem onClick={close}>
          <ListItemText>
            <StyledLink to="/scheduled">
              <ListItemIcon>
                <NotificationsNone sx={{ color: "primary.main" }} />
              </ListItemIcon>
              Scheduled
            </StyledLink>
          </ListItemText>
        </ListItem>
        <ListItem onClick={close}>
          <ListItemText>
            <StyledLink to="/search">
              <ListItemIcon>
                <SearchOutlined sx={{ color: "primary.main" }} />
              </ListItemIcon>
              Search
            </StyledLink>
          </ListItemText>
        </ListItem>
      </List>
    </MenuContainer>
  );
};

const MenuContainer = styled("div")`
  padding: 16px 32px 16px 16px;
`;

const StyledLink = styled(Link)`
  display: flex;
`;
