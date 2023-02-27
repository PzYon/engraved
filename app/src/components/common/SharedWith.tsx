import { IMetric } from "../../serverApi/IMetric";
import React from "react";
import { Avatar, AvatarGroup } from "@mui/material";

export const SharedWith: React.FC<{ metric: IMetric }> = ({ metric }) => {
  return (
    <AvatarGroup max={4} sx={{ display: "inline-flex" }}>
      {Object.keys(metric.permissions).map((i) => {
        const user = metric.permissions[i].user;
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
