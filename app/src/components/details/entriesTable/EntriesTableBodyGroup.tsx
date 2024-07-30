import React, { useEffect, useState } from "react";
import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { IEntriesTableColumnDefinition } from "./IEntriesTableColumnDefinition";
import { TableCell, TableRow } from "@mui/material";
import { IEntry } from "../../../serverApi/IEntry";
import { EntrySubRoutes } from "../../common/entries/EntrySubRoutes";

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
        {columns.map((c) => (
          <TableCell key={c.key} className={c.className}>
            {group.entries.length > 1
              ? c.getGroupReactNode?.(group, () => setIsCollapsed(!isCollapsed))
              : renderValueNode(c, group.entries[0], true)}
          </TableCell>
        ))}
      </TableRow>
    );
  }

  return (
    <>
      {group.entries.map((entry, i) => (
        <React.Fragment key={entry.id}>
          <TableRow key={entry.id}>
            {columns.map((c) => (
              <TableCell key={c.key} className={c.className}>
                {renderValueNode(c, entry, i === 0)}
              </TableCell>
            ))}
          </TableRow>

          <EntrySubRoutes
            entry={entry}
            render={(child: React.ReactElement) => (
              <TableRow key="routes" className="action-row">
                <TableCell colSpan={columns.length}>{child}</TableCell>
              </TableRow>
            )}
          />
        </React.Fragment>
      ))}
      {showGroupTotals ? (
        <TableRow key="totals">
          {columns.map((c) => (
            <TableCell
              key={c.key}
              sx={{ opacity: 0.5 }}
              className={c.className}
            >
              {c.isAggregatable ? group.totalString : ""}
            </TableCell>
          ))}
        </TableRow>
      ) : null}
    </>
  );

  function renderValueNode(
    column: IEntriesTableColumnDefinition,
    entry: IEntry,
    isFirstRow: boolean,
  ) {
    return column.getValueReactNode(group, entry, isFirstRow, () =>
      setIsCollapsed(!isCollapsed),
    );
  }
};
