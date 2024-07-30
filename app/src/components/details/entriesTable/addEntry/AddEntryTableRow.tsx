import { styled, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { IEntriesTableColumnDefinition } from "../IEntriesTableColumnDefinition";
import { IUpsertGaugeEntryCommand } from "../../../../serverApi/commands/IUpsertGaugeEntryCommand";
import { DeviceWidth, useDeviceWidth } from "../../../common/useDeviceWidth";
import { IJournal } from "../../../../serverApi/IJournal";

export const AddEntryTableRow: React.FC<{
  journal: IJournal;
  columns: IEntriesTableColumnDefinition[];
}> = ({ journal, columns }) => {
  const [command, setCommand] = useState<IUpsertGaugeEntryCommand>({
    journalId: journal.id,
    value: undefined,
    dateTime: new Date(),
  });

  const [key, setKey] = useState(Math.random());

  if (useDeviceWidth() === DeviceWidth.Small) {
    return null;
  }

  return (
    <TableRow key={key}>
      {columns.map((c) => (
        <TableCell key={c.key} sx={{ verticalAlign: "top" }}>
          <InnerContainer>
            {c.getAddEntryReactNode?.(command, (c, isReset) => {
              setCommand(c);

              if (isReset) {
                setKey(Math.random());
              }
            })}
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
