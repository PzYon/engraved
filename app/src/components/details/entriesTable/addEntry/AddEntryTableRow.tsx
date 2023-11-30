import { styled, TableCell } from "@mui/material";
import React, { useState } from "react";
import { IEntriesTableColumnDefinition } from "../IEntriesTableColumnDefinition";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";
import { StyledTableRow } from "../EntriesTable";
import { DeviceWidth, useDeviceWidth } from "../../../common/useDeviceWidth";
import { IJournal } from "../../../../serverApi/IJournal";
import { JournalType } from "../../../../serverApi/JournalType";

export const AddEntryTableRow: React.FC<{
  journal: IJournal;
  columns: IEntriesTableColumnDefinition[];
}> = ({ journal, columns }) => {
  const [command, setCommand] = useState<IUpsertGaugeEntryCommand>({
    journalId: journal.id,
    value: undefined,
    dateTime: new Date(),
  });

  if (
    useDeviceWidth() === DeviceWidth.Small ||
    (journal.type !== JournalType.Gauge && journal.type !== JournalType.Counter)
  ) {
    return null;
  }

  return (
    <StyledTableRow>
      {columns.map((c) => (
        <TableCell key={c.key} sx={{ verticalAlign: "top" }}>
          <InnerContainer>
            {c.getEditModeReactNode?.(command, setCommand)}
          </InnerContainer>
        </TableCell>
      ))}
    </StyledTableRow>
  );
};

const InnerContainer = styled("div")`
  display: flex;
  flex-direction: column;
  justify-content: start;
`;
