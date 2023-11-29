import React from "react";
import { DateSelector } from "../../../common/DateSelector";
import { TextField } from "@mui/material";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";

export const NewEntriesTableCell: React.FC<{
  command: IUpsertGaugeEntryCommand;
  updateCommand: (c: IUpsertGaugeEntryCommand) => void;
  fieldName: string;
  fieldType: "text" | "number" | "date";
}> = ({ command, updateCommand, fieldName, fieldType = "text" }) => {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const value = (command as any)[fieldName];

  console.log(fieldName + ": " + value);

  const updateCommandWrapped = (value: string) => {
    updateCommand({
      ...command,
      [fieldName]: value,
    });
  };

  if (fieldType === "date") {
    return (
      <DateSelector
        setDate={(d) => {
          updateCommandWrapped(d.toString());
        }}
        date={new Date(value)}
      />
    );
  }

  return (
    <TextField
      value={value}
      type={fieldType === "number" ? "number" : undefined}
      onChange={(event) => updateCommandWrapped(event.target.value)}
      sx={{
        marginBottom: "0",
      }}
    />
  );
};
