import React, { useMemo } from "react";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import { translations } from "../../../i18n/translations";
import { IMetric } from "../../../serverApi/IMetric";
import { DateFormat, FormatDate } from "../../common/FormatDate";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { AttributeValues } from "../../common/AttributeValues";
import { DataTable } from "./DataTable";
import { IDataTableColumnDefinition } from "./IDataTableColumnDefinition";
import { Typography } from "@mui/material";
import { MeasurementActionButtons } from "./MeasurementActionButtons";
import { getGroupKey, getMeasurementsTableGroups } from "./measurementsStuff";

export const MeasurementsList: React.FC<{
  metric: IMetric;
  measurements: IMeasurement[];
  showGroupTotals: boolean;
}> = ({ metric, measurements, showGroupTotals }) => {
  const columns = useMemo(() => {
    return [
      ...getColumnsBefore(metric),
      ...MetricTypeFactory.create(metric.type).getMeasurementsListColumns(),
      ...getColumnsAfter(metric),
    ].filter((c) => c.doHide?.(metric) !== true);
  }, [metric]);

  const tableGroups = getMeasurementsTableGroups(measurements, metric.type);

  return (
    <DataTable
      tableGroups={tableGroups}
      columns={columns}
      showGroupTotals={showGroupTotals}
    />
  );
};

const getColumnsBefore = (metric: IMetric): IDataTableColumnDefinition[] => [
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
    getGroupKey: (measurement) => getGroupKey(metric.type, measurement),
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
      <MeasurementActionButtons
        measurement={measurement}
        metricId={metric.id}
      />
    ),
  },
];
