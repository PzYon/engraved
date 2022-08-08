import React, { useMemo } from "react";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import { translations } from "../../../i18n/translations";
import { IMetric } from "../../../serverApi/IMetric";
import { DateFormat, FormatDate } from "../../common/FormatDate";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { AttributeValues } from "../../common/AttributeValues";
import { DataTable } from "./DataTable";
import { IDataTableColumnDefinition } from "./IDataTableColumnDefinition";
import { format } from "date-fns";
import { Typography } from "@mui/material";
import { ActionButtons } from "./ActionButtons";

const getColumnsBefore = (): IDataTableColumnDefinition[] => [
  {
    header: translations.columnName_date,
    key: "_date",
    getValueReactNode: (measurement) => (
      <>
        <FormatDate
          value={measurement.dateTime}
          dateFormat={DateFormat.dateOnly}
        />
        <br />
        <Typography sx={{ opacity: 0.5 }} fontSize={"smaller"}>
          <FormatDate
            value={measurement.dateTime}
            dateFormat={DateFormat.relativeToNowDayPlus}
          />
        </Typography>
      </>
    ),
    getGroupKey: (measurement) => {
      const date = new Date(measurement.dateTime);
      return format(date, "u-LL-dd");
    },
  },
];

const getColumnsAfter = (metric: IMetric): IDataTableColumnDefinition[] => [
  {
    header: translations.columnName_attributes,
    key: "_attributes",
    doHide: (metric: IMetric): boolean =>
      !metric.attributes || !Object.keys(metric.attributes).length,
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
    header: translations.columnName_actions,
    key: "_actions",
    getValueReactNode: (measurement) => (
      <ActionButtons measurement={measurement} metricId={metric.id} />
    ),
  },
];

export const MeasurementsList: React.FC<{
  metric: IMetric;
  measurements: IMeasurement[];
}> = ({ metric, measurements }) => {
  const columns = useMemo(() => {
    return [
      ...getColumnsBefore(),
      ...MetricTypeFactory.create(metric.type).getMeasurementsListColumns(),
      ...getColumnsAfter(metric),
    ].filter((c) => c.doHide?.(metric) !== true);
  }, [metric]);

  return <DataTable measurements={measurements} columns={columns} />;
};
