import React, { useMemo } from "react";
import { IMeasurement } from "../../../serverApi/IMeasurement";
import { translations } from "../../../i18n/translations";
import { IMetric } from "../../../serverApi/IMetric";
import { DateFormat, FormatDate } from "../../common/FormatDate";
import { MetricTypeFactory } from "../../../metricTypes/MetricTypeFactory";
import { AttributeValues } from "../../common/AttributeValues";
import { IMeasurementsListColumnDefinition } from "./IMeasurementsListColumnDefinition";
import {
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

  const tableGroups = useMemo(() => {
    return getMeasurementsTableGroups(measurements, metric.type);
  }, [measurements]);

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
          <>
            {group.measurements.map((measurement, i) => (
              <>
                <TableRow key={measurement.id}>
                  {columns.map((c) =>
                    i > 0 && c.getGroupKey?.(measurement) ? (
                      <TableCell key={c.key} />
                    ) : (
                      <TableCell key={c.key}>
                        {c.getValueReactNode(measurement)}
                      </TableCell>
                    )
                  )}
                </TableRow>
              </>
            ))}
            {showGroupTotals ? (
              <TableRow>
                <>
                  {columns.map((c) => {
                    return c.isSummable ? (
                      <TableCell>{group.totalString}</TableCell>
                    ) : (
                      <TableCell />
                    );
                  })}
                </>
              </TableRow>
            ) : null}
          </>
        ))}
      </TableBody>
      {measurements.length && columns.filter((c) => c.isSummable).length ? (
        <TableFooter>
          <TableRow>
            {columns.map((c) => (
              <TableCell key={c.key}>
                {c.isSummable
                  ? tableGroups
                      .map((g) => g.totalValue)
                      .reduce(
                        (previousValue, currentValue) =>
                          previousValue + currentValue,
                        0
                      )
                  : null}
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
  metricType: MetricType
): IMeasurementsTableGroup[] {
  const type = MetricTypeFactory.create(metricType);

  const groupsByKey: { [groupKey: string]: IMeasurementsTableGroup } = {};

  for (const measurement of measurements) {
    const groupKey = getGroupKey(metricType, measurement);

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
