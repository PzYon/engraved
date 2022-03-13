import React from "react";
import { IMeasurement } from "../../serverApi/IMeasurement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { format } from "date-fns";
import { translations } from "../../i18n/translations";

export const DataGrid: React.FC<{
  measurements: IMeasurement[];
}> = ({ measurements }) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>{translations.columnName_date}</TableCell>
          <TableCell>{translations.columnName_value}</TableCell>
          <TableCell>{translations.columnName_notes}</TableCell>
          <TableCell>{translations.columnName_flag}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {measurements.map((measurement) => {
          return (
            <TableRow key={measurement.dateTime}>
              <TableCell>
                {format(new Date(measurement.dateTime), "PPPPpppp")}
              </TableCell>
              <TableCell>{measurement.value}</TableCell>
              <TableCell>{measurement.notes}</TableCell>
              <TableCell>{measurement.metricFlagKey}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
