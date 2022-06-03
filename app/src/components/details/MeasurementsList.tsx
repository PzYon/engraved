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
import { IMetric } from "../../serverApi/IMetric";

export const MeasurementsList: React.FC<{
  metric: IMetric;
  measurements: IMeasurement[];
}> = ({ metric, measurements }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>{translations.columnName_date}</TableCell>
        <TableCell>{translations.columnName_value}</TableCell>
        <TableCell>{translations.columnName_attributes}</TableCell>
        <TableCell>{translations.columnName_notes}</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {measurements.map((measurement) => (
        <TableRow key={measurement.dateTime}>
          <TableCell>
            {format(new Date(measurement.dateTime), "PPPPpppp")}
          </TableCell>
          <TableCell>{measurement.value}</TableCell>
          <TableCell>{JSON.stringify(metric.attributes)}</TableCell>
          <TableCell>{measurement.notes}</TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);
