import React from "react";
import { DateSelector } from "../../../common/DateSelector";
import { TextField } from "@mui/material";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";
import { JournalAttributesSelector } from "../../add/JournalAttributesSelector";
import { IJournal } from "../../../../serverApi/IJournal";
import { AttributeComboSearch } from "../../add/AttributeComboSearch";
import { IJournalAttributeValues } from "../../../../serverApi/IJournalAttributeValues";

export const AddEntryTableCell: React.FC<{
  journal: IJournal;
  command: IUpsertGaugeEntryCommand;
  updateCommand: (c: IUpsertGaugeEntryCommand) => void;
  fieldName: string;
  fieldType?: "text" | "number" | "date" | "attributes";
  hasFocus?: boolean;
}> = ({
  journal,
  command,
  updateCommand,
  fieldName,
  fieldType = "text",
  hasFocus,
}) => {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const currentValue = (command as any)[fieldName] ?? "";

  const updateCommandWrapped = (value: any) => {
    updateCommand({
      ...command,
      [fieldName]: value,
    });
  };

  switch (fieldType) {
    case "date": {
      return (
        <DateSelector
          hasFocus={hasFocus}
          date={new Date(currentValue)}
          setDate={updateCommandWrapped}
        />
      );
    }

    case "attributes": {
      const journalAttributeValues = command.journalAttributeValues ?? {};
      return (
        <>
          <AttributeComboSearch
            journal={journal}
            onChange={(value: IJournalAttributeValues) => {
              updateCommand({
                ...command,
                [fieldName]: value,
              });
            }}
          />
          <JournalAttributesSelector
            key={JSON.stringify(journalAttributeValues)}
            attributes={journal.attributes}
            selectedAttributeValues={journalAttributeValues}
            onChange={(value: any) => {
              updateCommand({
                ...command,
                [fieldName]: { ...currentValue, ...value },
              });
            }}
          />
        </>
      );
    }

    case "number": {
      return (
        <TextField
          value={currentValue}
          onChange={(event) => {
            updateCommandWrapped(Number(event.target.value));
          }}
          type={"number"}
          sx={{ marginBottom: "0" }}
        />
      );
    }

    default: {
      return (
        <TextField
          value={currentValue}
          onChange={(event) => {
            updateCommandWrapped(event.target.value);
          }}
          sx={{ marginBottom: "0" }}
        />
      );
    }
  }
};
