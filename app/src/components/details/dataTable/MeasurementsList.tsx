import React, { useMemo } from "react";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import { translations } from "../../../i18n/translations";
import { IMetric } from "../../../serverApi/IMetric";
import { Edit } from "@mui/icons-material";
import { IconButtonWrapper } from "../../common/IconButtonWrapper";
import { FormatDate } from "../../common/FormatDate";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { AttributeValues } from "../../common/AttributeValues";
import { DataTable } from "./DataTable";
import { IDataTableColumnDefinition } from "./IDataTableColumnDefinition";

const getColumnsBefore = (): IDataTableColumnDefinition[] => [
  {
    header: translations.columnName_date,
    key: "_date",
    getValueReactNode: (measurement) => (
      <FormatDate value={measurement.dateTime} />
    ),
  },
];

const getColumnsAfter = (metric: IMetric): IDataTableColumnDefinition[] => [
  {
    header: translations.columnName_attributes,
    key: "_attributes",
    getValueReactNode: (measurement) => (
      <AttributeValues
        attributes={metric.attributes}
        attributeValues={measurement.metricAttributeValues}
      />
    ),
  },
  {
    header: translations.columnName_notes,
    key: "_notes",
    getValueReactNode: (measurement) => measurement.notes,
  },
  {
    header: translations.columnName_edit,
    key: "_edit",
    getValueReactNode: (measurement) => (
      <IconButtonWrapper
        action={{
          key: "edit-measurement",
          label: "Edit Measurement",
          href: `/metrics/${metric.id}/measurements/${measurement.id}/edit`,
          icon: <Edit fontSize="small" />,
        }}
      />
    ),
  },
];

export const MeasurementsList: React.FC<{
  metric: IMetric;
  measurements: IMeasurement[];
}> = ({ metric, measurements }) => {
  const columns = useMemo(
    () => [
      ...getColumnsBefore(),
      ...MetricTypeFactory.create(metric.type).getMeasurementsListColumns(),
      ...getColumnsAfter(metric),
    ],
    [metric]
  );

  return <DataTable measurements={measurements} columns={columns} />;
};
