import React from "react";
import { IUser } from "../../serverApi/IUser";
import { Avatar, styled, Typography } from "@mui/material";

export const User: React.FC<{ user: IUser; showUserName?: boolean }> = ({
  user,
  showUserName,
}) => {
  const userName = user.displayName || user.name;

  return (
    <Host>
      <Avatar title={userName} src={user.imageUrl} />
      {showUserName ? (
        <Typography sx={{ padding: "10px;" }}>{userName}</Typography>
      ) : null}
    </Host>
  );
};

const Host = styled("div")`
  display: flex;
  align-items: center;
`;
