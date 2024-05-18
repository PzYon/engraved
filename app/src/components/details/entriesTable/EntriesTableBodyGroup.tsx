import React, { useEffect, useState } from "react";
import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { IEntriesTableColumnDefinition } from "./IEntriesTableColumnDefinition";
import { TableCell, TableRow } from "@mui/material";
import { StyledTableRow } from "./EntriesTable";
import { IEntry } from "../../../serverApi/IEntry";
import { Route, Routes, useNavigate } from "react-router-dom";
import { DeleteEntry } from "../edit/DeleteEntry";

export const EntriesTableBodyGroup: React.FC<{
  group: IEntriesTableGroup;
  columns: IEntriesTableColumnDefinition[];
  showGroupTotals: boolean;
  isGroupCollapsed: boolean;
}> = ({ group, columns, showGroupTotals, isGroupCollapsed }) => {
  const [isCollapsed, setIsCollapsed] = useState(isGroupCollapsed);

  const navigate = useNavigate();

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
                : renderValueNode(c, group.entries[0], true)}
            </TableCell>
          );
        })}
      </StyledTableRow>
    );
  }

  return (
    <>
      {group.entries.map((entry, i) => (
        <>
          <StyledTableRow key={entry.id}>
            {columns.map((c) => (
              <TableCell key={c.key}>
                {renderValueNode(c, entry, i === 0)}
              </TableCell>
            ))}
          </StyledTableRow>
          <StyledTableRow key="routes">
            <TableCell colSpan={columns.length}>
              <Routes>
                <Route
                  path={`${entry.id}/delete`}
                  element={
                    <DeleteEntry
                      entry={entry}
                      onCancel={() => navigate("..")}
                    />
                  }
                />
              </Routes>
            </TableCell>
          </StyledTableRow>
        </>
      ))}
      {showGroupTotals ? (
        <TableRow>
          {columns.map((c) => (
            <TableCell key={c.key} sx={{ opacity: 0.5 }}>
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
