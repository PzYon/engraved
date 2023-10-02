import { TextField } from "@mui/material";
import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { useEditJournalMutation } from "../../../serverApi/reactQuery/mutations/useEditJournalMutation";

export const JournalNotes: React.FC<{
  journal: IJournal;
}> = ({ journal }) => {
  const editJournalMutation = useEditJournalMutation(journal.id);

  return (
    <TextField
      defaultValue={journal.notes}
      onBlur={(event) => {
        editJournalMutation.mutate({
          metric: {
            ...journal,
            notes: event.target.value,
          },
        });
      }}
      multiline={true}
      label={"Notes"}
      sx={{ width: "100%", marginTop: 1 }}
      margin={"normal"}
    />
  );
};
