import React from "react";
import { IJournal } from "../../../serverApi/IJournal";
import { IEntry } from "../../../serverApi/IEntry";
import { AttributeValues } from "../AttributeValues";
import { Typography } from "@mui/material";
import { Entry } from "./Entry";
import { ActionFactory } from "../actions/ActionFactory";
import { getUiSettings } from "../../../util/journalUtils";
import { formatDateOnly } from "../../../util/utils";

export const EntryWithValue: React.FC<{
  value: React.ReactNode;
  journal: IJournal;
  entry: IEntry;
  hasFocus?: boolean;
}> = ({ journal, entry, value, hasFocus }) => {
  return (
    <Entry
      journalId={journal.id}
      journalType={journal.type}
      journalName={journal.name}
      entry={entry}
      actions={[
        ActionFactory.editEntry(entry, hasFocus),
        ActionFactory.deleteEntry(entry, hasFocus),
      ]}
      propsRenderStyle={"all"}
    >
      <Typography component={"span"} sx={{ fontWeight: "lighter" }}>
        {formatDateOnly(new Date(entry.dateTime))}
        {": "}
      </Typography>

      <Typography component={"span"}>{getValue()} </Typography>

      <Typography component={"span"} sx={{ fontWeight: "lighter" }}>
        {entry.notes ? ` - ${entry.notes}` : ""}
      </Typography>
      <AttributeValues
        attributes={journal.attributes}
        attributeValues={entry.journalAttributeValues}
      />
    </Entry>
  );

  function getValue() {
    const unit = getUiSettings(journal)?.yAxisUnit;
    if (unit) {
      return (
        <>
          {value} {unit}
        </>
      );
    }

    return value;
  }
};
