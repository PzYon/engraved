import React from "react";
import { Typography } from "@mui/material";
import { IJournal } from "../../serverApi/IJournal";
import { useParams } from "react-router-dom";

export const OnNotification: React.FC<{
  journal: IJournal;
  onCancel: () => void;
}> = ({ journal }) => {
  const { entryId } = useParams();

  return (
    <div>
      <Typography>
        {entryId ? " Entry" : "Journal "} has been notified. Journal name:{" "}
        {journal.name}
      </Typography>
      Actions: Clear schedule, Adjust schedule , Delete (maybe not for journal?)
    </div>
  );
};
