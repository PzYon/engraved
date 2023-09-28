import React, { useEffect, useState } from "react";
import { IMeasurementsTableGroup } from "./IMeasurementsTableGroup";
import { IMeasurementsTableColumnDefinition } from "./IMeasurementsTableColumnDefinition";
import { TableCell, TableRow } from "@mui/material";

export const MeasurementsTableBodyGroup: React.FC<{
  group: IMeasurementsTableGroup;
  columns: IMeasurementsTableColumnDefinition[];
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
      {group.measurements.map((measurement, i) => (
        <TableRow key={measurement.id}>
          {columns.map((c) => (
            <TableCell key={c.key}>
              {c.getValueReactNode(group, measurement, i === 0, () =>
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
