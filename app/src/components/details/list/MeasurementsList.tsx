import React, { useEffect, useMemo, useState } from "react";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import { translations } from "../../../i18n/translations";
import { IMetric } from "../../../serverApi/IMetric";
import { DateFormat, FormatDate } from "../../common/FormatDate";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { AttributeValues } from "../../common/AttributeValues";
import { IMeasurementsListColumnDefinition } from "./IMeasurementsListColumnDefinition";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { MeasurementActionButtons } from "./MeasurementActionButtons";
import { MetricType } from "../../../serverApi/MetricType";
import { ITimerMeasurement } from "../../../serverApi/ITimerMeasurement";
import { format } from "date-fns";
import { IMeasurementsTableGroup } from "./IMeasurementsListGroup";
import { IMetricType } from "../../../metricTypes/IMetricType";
import { ExpandMore } from "@mui/icons-material";

export const MeasurementsList: React.FC<{
  metric: IMetric;
  measurements: IMeasurement[];
  showGroupTotals: boolean;
}> = ({ metric, measurements, showGroupTotals }) => {
  const type = useMemo(
    () => MetricTypeFactory.create(metric.type),
    [metric?.type]
  );

  const columns = useMemo(() => {
    return [
      ...getColumnsBefore(metric),
      ...type.getMeasurementsListColumns(),
      ...getColumnsAfter(metric),
    ].filter((c) => c.doHide?.(metric) !== true);
  }, [metric]);

  const [tableGroups, setTableGroups] = useState<IMeasurementsTableGroup[]>([]);

  useEffect(() => {
    updateGroups();

    const interval =
      type.type === MetricType.Timer ? setInterval(updateGroups, 10000) : null;
    return () => clearInterval(interval);
  }, [metric, measurements]);

  function updateGroups() {
    setTableGroups(getMeasurementsTableGroups(measurements, type));
  }

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
        {tableGroups.map((group) => (
          <Groupppp
            key={group.label}
            group={group}
            columns={columns}
            showGroupTotals={showGroupTotals}
          />
        ))}
      </TableBody>
      {measurements.length && columns.filter((c) => c.isSummable).length ? (
        <TableFooter>
          <TableRow>
            {columns.map((c) => (
              <TableCell key={c.key}>
                {getTotalValue(c, tableGroups, type)}
              </TableCell>
            ))}
          </TableRow>
        </TableFooter>
      ) : null}
    </Table>
  );
};

function getColumnsBefore(
  metric: IMetric
): IMeasurementsListColumnDefinition[] {
  return [
    {
      header: undefined,
      key: "_collapse",
      getValueReactNode: (_, onClick) => (
        <IconButton onClick={onClick}>
          <ExpandMore />
        </IconButton>
      ),
    },
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
}

function getColumnsAfter(metric: IMetric): IMeasurementsListColumnDefinition[] {
  return [
    {
      header: translations.columnName_attributes,
      key: "_attributes",
      doHide: (metric: IMetric): boolean =>
        !Object.keys(metric.attributes ?? {}).length,
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
}

function getMeasurementsTableGroups(
  measurements: IMeasurement[],
  type: IMetricType
): IMeasurementsTableGroup[] {
  const groupsByKey: { [groupKey: string]: IMeasurementsTableGroup } = {};

  for (const measurement of measurements) {
    const groupKey = getGroupKey(type.type, measurement);

    if (!groupsByKey[groupKey]) {
      groupsByKey[groupKey] = {
        label: groupKey,
        measurements: [],
        totalValue: 0,
        totalString: "0",
      };
    }

    groupsByKey[groupKey].measurements.push(measurement);

    const total = groupsByKey[groupKey].totalValue + type.getValue(measurement);

    groupsByKey[groupKey].totalValue = total;
    groupsByKey[groupKey].totalString = type.formatTotalValue
      ? type.formatTotalValue(total)
      : total.toString();
  }

  return Object.values(groupsByKey);
}

function getGroupKey(metricType: MetricType, measurement: IMeasurement) {
  const relevantDate =
    metricType === MetricType.Timer
      ? (measurement as ITimerMeasurement).startDate
      : measurement.dateTime;

  return format(new Date(relevantDate), "u-LL-dd");
}

function getTotalValue(
  columnDefinition: IMeasurementsListColumnDefinition,
  tableGroups: IMeasurementsTableGroup[],
  type: IMetricType
) {
  if (!columnDefinition.isSummable) {
    return null;
  }

  const totalValue = tableGroups
    .map((g) => g.totalValue)
    .reduce((total, current) => total + current, 0);

  return type.formatTotalValue?.(totalValue) ?? totalValue;
}

export const Groupppp: React.FC<{
  group: IMeasurementsTableGroup;
  columns: IMeasurementsListColumnDefinition[];
  showGroupTotals: boolean;
}> = ({ group, columns, showGroupTotals }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <TableRow key={group.label}>
        {columns.map((c) => {
          if (c.key === "_collapse") {
            return (
              <TableCell key={c.key}>
                {c.getValueReactNode(null, () => setIsCollapsed(!isCollapsed))}
              </TableCell>
            );
          }

          return (
            <TableCell key={c.key}>
              {c.key === "_date"
                ? c.getValueReactNode(group.measurements[0])
                : ""}
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
              {i > 0 && c.getGroupKey?.(measurement)
                ? ""
                : c.getValueReactNode(
                    measurement,
                    c.key === "_collapse"
                      ? () => setIsCollapsed(!isCollapsed)
                      : null
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
