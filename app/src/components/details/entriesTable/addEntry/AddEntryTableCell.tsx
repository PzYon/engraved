import React from "react";
import { DateSelector } from "../../../common/DateSelector";
import { TextField } from "@mui/material";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";
import { IJournalAttributeValues } from "../../../../serverApi/IJournalAttributeValues";
import { JournalAttributesSelector } from "../../add/JournalAttributesSelector";
import { IJournal } from "../../../../serverApi/IJournal";

export const AddEntryTableCell: React.FC<{
  journal: IJournal;
  command: IUpsertGaugeEntryCommand;
  updateCommand: (c: IUpsertGaugeEntryCommand) => void;
  fieldName: string;
  fieldType: "text" | "number" | "date" | "attributes";
}> = ({ journal, command, updateCommand, fieldName, fieldType = "text" }) => {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const value = (command as any)[fieldName] ?? "";

  const updateCommandWrapped = (value: any) => {
    updateCommand({
      ...command,
      [fieldName]: value,
    });
  };

  if (fieldType === "date") {
    return (
      <DateSelector
        date={new Date(value)}
        setDate={(d) => {
          updateCommandWrapped(d.toString());
        }}
      />
    );
  }

  if (fieldType === "attributes") {
    return (
      <JournalAttributesSelector
        attributes={journal.attributes}
        selectedAttributeValues={{}}
        onChange={(attributesValues: IJournalAttributeValues) => {
          updateCommandWrapped(attributesValues);
        }}
      />
    );
  }

  return (
    <TextField
      value={value}
      onChange={(event) => {
        updateCommandWrapped(event.target.value);
      }}
      type={fieldType === "number" ? "number" : undefined}
      sx={{ marginBottom: "0" }}
    />
  );
};
