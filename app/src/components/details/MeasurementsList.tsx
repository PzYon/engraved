import React from "react";
import { IMeasurement } from "../../serverApi/IMeasurement";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { translations } from "../../i18n/translations";
import { IMetric } from "../../serverApi/IMetric";
import { Edit } from "@mui/icons-material";
import { IconButtonWrapper } from "../common/IconButtonWrapper";
import { FormatDate } from "../common/FormatDate";
import { MetricTypeFactory } from "../../metricTypes/MetricTypeFactory";
import { AttributeValues } from "../common/AttributeValues";

export const MeasurementsList: React.FC<{
  metric: IMetric;
  measurements: IMeasurement[];
}> = ({ metric, measurements }) => {
  const metricType = MetricTypeFactory.create(metric.type);
  const columns = metricType.getMeasurementsListColumns();

  return (
    <Table>
      <TableHead>
        <TableRow>
          {!metricType.hideDateColumnInMeasurementsList ? (
            <TableCell>{translations.columnName_date}</TableCell>
          ) : null}
          {columns.map((c) => (
            <TableCell key={c.key}>{c.header}</TableCell>
          ))}
          <TableCell>{translations.columnName_attributes}</TableCell>
          <TableCell>{translations.columnName_notes}</TableCell>
          <TableCell>{translations.columnName_edit}</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {measurements.map((measurement) => (
          <TableRow key={measurement.id}>
            {!metricType.hideDateColumnInMeasurementsList ? (
              <TableCell>
                <FormatDate value={measurement.dateTime} />
              </TableCell>
            ) : null}
            {columns.map((c) => {
              return (
                <TableCell key={c.key}>{c.getValue(measurement)}</TableCell>
              );
            })}
            <TableCell>
              <AttributeValues
                attributes={metric.attributes}
                attributeValues={measurement.metricAttributeValues}
              />
            </TableCell>
            <TableCell>{measurement.notes}</TableCell>
            <TableCell>
              <IconButtonWrapper
                action={{
                  key: "edit-measurement",
                  label: "Edit Measurement",
                  href: `/metrics/${metric.id}/measurements/${measurement.id}/edit`,
                  icon: <Edit fontSize="small" />,
                }}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
