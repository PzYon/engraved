import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import { IDataTableColumnDefinition } from "./IDataTableColumnDefinition";

export const DataTable: React.FC<{
  columns: IDataTableColumnDefinition[];
  measurements: IMeasurement[];
}> = ({ columns, measurements }) => {
  const sums: { [key: string]: number } = {};

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
        {measurements.map((measurement) => (
          <TableRow key={measurement.id}>
            {columns.map((c) => {
              if (c.isSummable) {
                if (!sums[c.key]) {
                  sums[c.key] = 0;
                }

                if (!c.getRawValue) {
                  throw new Error(
                    "getRawValue must be defined for summable columns,"
                  );
                }

                sums[c.key] += c.getRawValue(measurement);
              }

              return (
                <TableCell key={c.key}>
                  {c.getValueReactNode(measurement)}
                </TableCell>
              );
            })}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        {columns.map((c) => (
          <TableCell key={c.key}>{c.isSummable ? sums[c.key] : null}</TableCell>
        ))}
      </TableFooter>
    </Table>
  );
};
