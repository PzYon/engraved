import React from "react";
import { IUser } from "../../serverApi/IUser";
import { Avatar, styled, Typography } from "@mui/material";
import { MuiTheme } from "../../theming/engravedTheme";

export const User: React.FC<{
  user: IUser;
  showUserName?: boolean;
  style?: React.CSSProperties;
}> = ({ user, showUserName, style }) => {
  const userName = user.displayName || user.name;

  return (
    <Host style={style}>
      <Avatar title={`${userName} (${user.name})`} src={user.imageUrl} />
      {showUserName ? (
        <Typography sx={{ padding: "10px;" }}>{userName}</Typography>
      ) : null}
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  align-items: center;
  border: 2px solid ${(p: MuiTheme) => p.theme.palette.common.white};
  border-radius: 100%;
`;
