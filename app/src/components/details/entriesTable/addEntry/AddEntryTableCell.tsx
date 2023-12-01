import React from "react";
import { DateSelector } from "../../../common/DateSelector";
import { styled, TextField } from "@mui/material";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";
import { JournalAttributesSelector } from "../../add/JournalAttributesSelector";
import { IJournal } from "../../../../serverApi/IJournal";

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
  const value = (command as any)[fieldName] ?? "";

  const updateCommandWrapped = (value: any) => {
    updateCommand({
      ...command,
      [fieldName]: value,
    });
  };

  switch (fieldType) {
    case "date":
      return (
        <DateSelector
          hasFocus={hasFocus}
          date={new Date(value)}
          setDate={updateCommandWrapped}
        />
      );

    case "attributes":
      return (
        <JournalAttributesSelectorWrapper>
          <JournalAttributesSelector
            attributes={journal.attributes}
            selectedAttributeValues={undefined}
            onChange={updateCommandWrapped}
          />
        </JournalAttributesSelectorWrapper>
      );

    case "number":
      return (
        <TextField
          value={value}
          onChange={(event) => {
            updateCommandWrapped(Number(event.target.value));
          }}
          type={"number"}
          sx={{ marginBottom: "0" }}
        />
      );

    default:
      return (
        <TextField
          value={value}
          onChange={(event) => {
            updateCommandWrapped(event.target.value);
          }}
          sx={{ marginBottom: "0" }}
        />
      );
  }
};

const JournalAttributesSelectorWrapper = styled("div")`
  .journal-attribute-selector-wrapper:first-of-type {
    margin-top: 0;
  }
`;
