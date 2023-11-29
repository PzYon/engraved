import { styled, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { IEntriesTableColumnDefinition } from "../IEntriesTableColumnDefinition";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";

export const AddEntryTableRow: React.FC<{
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
        <TableCell key={c.key} sx={{ verticalAlign: "top" }}>
          <InnerContainer>
            {c.getEditModeReactNode?.(command, setCommand) ?? <></>}
          </InnerContainer>
        </TableCell>
      ))}
    </TableRow>
  );
};

const InnerContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;
