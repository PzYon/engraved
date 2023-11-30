import React, { useEffect, useState } from "react";
import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { IEntriesTableColumnDefinition } from "./IEntriesTableColumnDefinition";
import { TableCell, TableRow } from "@mui/material";
import { StyledTableRow } from "./EntriesTable";

export const EntriesTableBodyGroup: React.FC<{
  group: IEntriesTableGroup;
  columns: IEntriesTableColumnDefinition[];
  showGroupTotals: boolean;
  isGroupCollapsed: boolean;
}> = ({ group, columns, showGroupTotals, isGroupCollapsed }) => {
  const [isCollapsed, setIsCollapsed] = useState(isGroupCollapsed);

  useEffect(() => setIsCollapsed(isGroupCollapsed), [isGroupCollapsed]);

  if (isCollapsed) {
    return (
      <StyledTableRow key={group.label}>
        {columns.map((c) => {
          return (
            <TableCell key={c.key}>
              {group.entries.length > 1
                ? c.getGroupReactNode?.(group, () =>
                    setIsCollapsed(!isCollapsed),
                  )
                : c.getValueReactNode(group, group.entries[0], true, () =>
                    setIsCollapsed(!isCollapsed),
                  )}
            </TableCell>
          );
        })}
      </StyledTableRow>
    );
  }

  return (
    <>
      {group.entries.map((entry, i) => (
        <StyledTableRow key={entry.id}>
          {columns.map((c) => (
            <TableCell key={c.key}>
              {c.getValueReactNode(group, entry, i === 0, () =>
                setIsCollapsed(!isCollapsed),
              )}
            </TableCell>
          ))}
        </StyledTableRow>
      ))}
      {showGroupTotals ? (
        <TableRow>
          {columns.map((c) => (
            <TableCell key={c.key} sx={{ opacity: 0.5 }}>
              {c.isSummable ? group.totalString : ""}
            </TableCell>
          ))}
        </TableRow>
      ) : null}
    </>
  );
};
