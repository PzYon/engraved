import { IJournal } from "../../serverApi/IJournal";
import React from "react";
import { Avatar, AvatarGroup } from "@mui/material";

export const SharedWith: React.FC<{ journal: IJournal }> = ({ journal }) => {
  return (
    <AvatarGroup max={4} sx={{ display: "inline-flex" }}>
      {Object.keys(journal.permissions).map((i) => {
        const user = journal.permissions[i].user;
        const title = user.displayName || user.name || i;
        return (
          <Avatar
            key={i}
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
