import { TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { IEntriesTableColumnDefinition } from "../IEntriesTableColumnDefinition";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";

export const NewEntriesTableRow: React.FC<{
  journalId: string;
  columns: IEntriesTableColumnDefinition[];
}> = ({ journalId, columns }) => {
  const [command, setCommand] = useState<IUpsertGaugeEntryCommand>({
    journalId: journalId,
    value: undefined,
  });

  return (
    <TableRow>
      {columns.map((c) => (
        <TableCell key={c.key}>
          {c.getEditModeReactNode?.(command, setCommand) ?? <></>}
        </TableCell>
      ))}
    </TableRow>
  );
};
