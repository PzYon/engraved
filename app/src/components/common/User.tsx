import React from "react";
import { IUser } from "../../serverApi/IUser";
import { Avatar, styled, Tooltip, Typography } from "@mui/material";

export const User: React.FC<{
  user: IUser;
  showUserName?: boolean;
  style?: React.CSSProperties;
}> = ({ user, showUserName, style }) => {
  const userName = user.displayName || user.name;

  return (
    <Host style={style}>
      <Tooltip title={`${userName} (${user.name})`}>
        <Avatar src={user.imageUrl} />
      </Tooltip>
      {showUserName ? (
        <Typography sx={{ padding: "10px;" }}>{userName}</Typography>
      ) : null}
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  align-items: center;
  border: 2px solid ${(p) => p.theme.palette.common.white};
  border-radius: 100%;
`;
