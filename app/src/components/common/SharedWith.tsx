import { IMetric } from "../../serverApi/IMetric";
import React from "react";
import { Avatar, AvatarGroup } from "@mui/material";

export const SharedWith: React.FC<{ metric: IMetric }> = ({ metric }) => {
  return (
    <AvatarGroup max={4} sx={{ display: "inline-flex" }}>
      {Object.keys(metric.permissions).map((i) => {
        const u = metric.permissions[i].user;
        return (
          <Avatar
            key={i}
            alt={u.displayName || u.name}
            src={u.imageUrl}
            sx={{ width: "15px", height: "15px", backgroundColor: "#2a7b9b" }}
          />
        );
      })}
    </AvatarGroup>
  );
};
