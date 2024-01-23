import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { IEntry } from "../../../serverApi/IEntry";
import { AttributeValues } from "../AttributeValues";
import { Typography } from "@mui/material";
import { Entry } from "./Entry";
import { ActionFactory } from "../actions/ActionFactory";

export const EntryWithValue: React.FC<{
  value: React.ReactNode;
  journal: IJournal;
  entry: IEntry;
}> = ({ journal, entry, value }) => {
  return (
    <Entry
      journalId={journal.id}
      journalType={journal.type}
      journalName={journal.name}
      entry={entry}
      actions={[
        ActionFactory.editEntry(entry),
        ActionFactory.deleteEntry(entry),
      ]}
    >
      <Typography component={"span"}>{value}</Typography>
      <Typography component={"span"} sx={{ fontWeight: "lighter" }}>
        {entry.notes ? ` - ${entry.notes}` : ""}
      </Typography>
      <AttributeValues
        attributes={journal.attributes}
        attributeValues={entry.journalAttributeValues}
      />
    </Entry>
  );
};
