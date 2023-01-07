import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { IDataTableColumnDefinition } from "./IDataTableColumnDefinition";
import { IMeasurementsTableGroup } from "./measurementsStuff";

export const DataTable: React.FC<{
  columns: IDataTableColumnDefinition[];
  tableGroups: IMeasurementsTableGroup[];
}> = ({ columns, tableGroups }) => {
  const sums: { [key: string]: number } = {};
  const groupKeys: { [key: string]: string } = {};

  return (
    <Table>
      <TableHead>
        <TableRow>
          {columns.map((c) => (
            <TableCell key={c.key}>{c.header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {tableGroups.map((group) => {
          return (
            <>
              {group.measurements.map((measurement) => (
                <>
                  <TableRow key={measurement.id}>
                    {columns.map((c) => {
                      if (c.isSummable) {
                        if (!c.getRawValue) {
                          throw new Error(
                            "getRawValue must be defined for summable columns,"
                          );
                        }

                        if (!sums[c.key]) {
                          sums[c.key] = 0;
                        }

                        sums[c.key] += c.getRawValue(measurement);
                      }

                      const currentGroupKey = c.getGroupKey?.(measurement);

                      const isKnownColumnWithKey =
                        currentGroupKey && currentGroupKey === groupKeys[c.key];

                      if (isKnownColumnWithKey) {
                        return <TableCell key={c.key} />;
                      }

                      groupKeys[c.key] = currentGroupKey;

                      return (
                        <TableCell key={c.key}>
                          {c.getValueReactNode(measurement)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                </>
              ))}
              <TableRow>
                <>
                  {columns.map((c) => {
                    return c.isSummable ? (
                      <TableCell>{group.total}</TableCell>
                    ) : (
                      <TableCell />
                    );
                  })}
                </>
              </TableRow>
            </>
          );
        })}
      </TableBody>
      {columns.filter((c) => c.isSummable).length ? (
        <TableFooter>
          <TableRow>
            {columns.map((c) => (
              <TableCell key={c.key}>
                {c.isSummable ? sums[c.key] : null}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  );
};
