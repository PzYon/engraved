import React from "react";
import { DateSelector } from "../../../common/DateSelector";
import { TextField } from "@mui/material";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";
import { JournalAttributesSelector } from "../../add/JournalAttributesSelector";
import { IJournal } from "../../../../serverApi/IJournal";
import { AttributeComboSearch } from "../../add/AttributeComboSearch";
import { IJournalAttributeValues } from "../../../../serverApi/IJournalAttributeValues";
import {
  getDefaultAttributeValues,
  showAttributeSearch,
} from "../../../../util/journalUtils";

export const AddEntryTableCell: React.FC<{
  journal?: IJournal;
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
  const currentValue =
    (command as unknown as Record<string, unknown>)[fieldName] ?? "";

  const updateCommandWrapped = (value: unknown) => {
    updateCommand({
      ...command,
      [fieldName]: value,
    } as IUpsertGaugeEntryCommand);
  };

  switch (fieldType) {
    case "date": {
      return (
        <DateSelector
          hasFocus={hasFocus}
          date={new Date(currentValue as number | string)}
          setDate={updateCommandWrapped}
        />
      );
    }

    case "attributes": {
      if (!journal) return null;
      const journalAttributeValues =
        command.journalAttributeValues ??
        getDefaultAttributeValues(journal.attributes);

      const showSearch = showAttributeSearch(journal);

      return (
        <>
          {showSearch ? (
            <AttributeComboSearch
              journal={journal}
              onChange={(value: IJournalAttributeValues) => {
                updateCommand({
                  ...command,
                  [fieldName]: value,
                });
              }}
            />
          ) : null}
          <JournalAttributesSelector
            key={JSON.stringify(journalAttributeValues)}
            attributes={journal.attributes ?? {}}
            noBorderTop={!showSearch}
            selectedAttributeValues={journalAttributeValues}
            onChange={(value: IJournalAttributeValues) => {
              updateCommand({
                ...command,
                [fieldName]: { ...(currentValue as object), ...value },
              } as IUpsertGaugeEntryCommand);
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
