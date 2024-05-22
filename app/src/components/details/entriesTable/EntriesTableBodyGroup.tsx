import React, { useEffect, useState } from "react";
import { IEntriesTableGroup } from "./IEntriesTableGroup";
import { IEntriesTableColumnDefinition } from "./IEntriesTableColumnDefinition";
import { TableCell, TableRow } from "@mui/material";
import { StyledTableRow } from "./EntriesTable";
import { IEntry } from "../../../serverApi/IEntry";
import { Route, Routes } from "react-router-dom";
import { DeleteEntryAction } from "../edit/DeleteEntryAction";
import { UpsertEntryAction } from "../add/UpsertEntryAction";
import { IJournal } from "../../../serverApi/IJournal";
import { NavigationActionContainer } from "../../common/entries/Entry";

export const EntriesTableBodyGroup: React.FC<{
  group: IEntriesTableGroup;
  columns: IEntriesTableColumnDefinition[];
  showGroupTotals: boolean;
  isGroupCollapsed: boolean;
  journal: IJournal;
}> = ({ group, columns, showGroupTotals, isGroupCollapsed, journal }) => {
  const [isCollapsed, setIsCollapsed] = useState(isGroupCollapsed);

  useEffect(() => setIsCollapsed(isGroupCollapsed), [isGroupCollapsed]);

  if (isCollapsed) {
    return (
      <StyledTableRow key={group.label}>
        {columns.map((c) => (
          <TableCell key={c.key}>
            {group.entries.length > 1
              ? c.getGroupReactNode?.(group, () => setIsCollapsed(!isCollapsed))
              : renderValueNode(c, group.entries[0], true)}
          </TableCell>
        ))}
      </StyledTableRow>
    );
  }

  return (
    <>
      {group.entries.map((entry, i) => (
        <React.Fragment key={entry.id}>
          <StyledTableRow key={entry.id}>
            {columns.map((c) => (
              <TableCell key={c.key}>
                {renderValueNode(c, entry, i === 0)}
              </TableCell>
            ))}
          </StyledTableRow>
          <Routes>
            <Route
              path={`actions/delete/${entry.id}`}
              element={
                <StyledTableRow key="routes">
                  <TableCell colSpan={columns.length}>
                    <NavigationActionContainer>
                      <DeleteEntryAction entry={entry} />
                    </NavigationActionContainer>
                  </TableCell>
                </StyledTableRow>
              }
            />
            <Route
              path={`actions/edit/${entry.id}`}
              element={
                <StyledTableRow key="routes">
                  <TableCell colSpan={columns.length}>
                    <NavigationActionContainer shrinkWidthIfPossible={true}>
                      <UpsertEntryAction journal={journal} entry={entry} />
                    </NavigationActionContainer>
                  </TableCell>
                </StyledTableRow>
              }
            />
          </Routes>
        </React.Fragment>
      ))}
      {showGroupTotals ? (
        <TableRow key="totals">
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
