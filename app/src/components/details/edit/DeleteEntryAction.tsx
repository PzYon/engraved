import { useDeleteEntryMutation } from "../../../serverApi/reactQuery/mutations/useDeleteEntryMutation";
import { DeleteButtons } from "../../common/DeleteButtons";
import React from "react";
import { Typography } from "@mui/material";
import { IEntry } from "../../../serverApi/IEntry";
import { IScrapEntry } from "../../../serverApi/IScrapEntry";
import { useNavigate } from "react-router-dom";

export const DeleteEntryAction: React.FC<{
  entry: IEntry;
}> = ({ entry }) => {
  const deleteEntryMutation = useDeleteEntryMutation(entry.parentId, entry.id);
  const navigate = useNavigate();

  const isScrapJournal = !!(entry as IScrapEntry).scrapType;

  return (
    <>
      <Typography>
        Are you sure you want to delete this{" "}
        <b>{isScrapJournal ? "scrap" : "entry"}</b>? You will not be able to
        recover it.
      </Typography>
      <DeleteButtons
        entityType={"entry"}
        requiresConfirmation={isScrapJournal}
        onDelete={() => {
          deleteEntryMutation.mutate();
          close();
        }}
        onCancel={close}
      />
    </>
  );

  function close() {
    navigate("..");
  }
};
