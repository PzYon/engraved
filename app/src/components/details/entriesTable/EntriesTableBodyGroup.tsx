import React, { useEffect, useState } from "react";
import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { IEntriesTableColumnDefinition } from "./IEntriesTableColumnDefinition";
import { TableCell, TableRow } from "@mui/material";

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
      <TableRow key={group.label}>
        {columns.map((c) => {
          return (
            <TableCell key={c.key}>
              {c.getGroupReactNode?.(group, () => setIsCollapsed(!isCollapsed))}
            </TableCell>
          );
        })}
      </TableRow>
    );
  }

  return (
    <>
      {group.entries.map((entry, i) => (
        <TableRow key={entry.id}>
          {columns.map((c) => (
            <TableCell key={c.key}>
              {c.getValueReactNode(group, entry, i === 0, () =>
                setIsCollapsed(!isCollapsed),
              )}
            </TableCell>
          ))}
        </TableRow>
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
