import React from "react";
import { Avatar, AvatarGroup } from "@mui/material";
import { IUser } from "../../serverApi/IUser";

export const Users: React.FC<{ users: IUser[] }> = ({ users }) => {
  return (
    <AvatarGroup max={4} sx={{ display: "inline-flex" }}>
      {users
        .filter((u) => !!u)
        .map((user) => {
          const title = user.displayName || user.name;
          return (
            <Avatar
              key={title}
              title={title}
              alt={title}
              src={user.imageUrl}
              sx={{ width: "15px", height: "15px", backgroundColor: "#2a7b9b" }}
            />
          );
        })}
    </AvatarGroup>
  );
};
