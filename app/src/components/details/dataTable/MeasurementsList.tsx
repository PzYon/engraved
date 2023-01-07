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
    groupsByKey[groupKey].totalValue += type.getValue(measurement);
    groupsByKey[groupKey].totalString = type.formatTotalValue
      ? type.formatTotalValue(groupsByKey[groupKey].totalValue)
      : groupsByKey[groupKey].totalValue.toString();
  }

  return Object.values(groupsByKey);
}

function getGroupKey(metricType: MetricType, measurement: IMeasurement) {
  return format(
    new Date(
      metricType === MetricType.Timer
        ? (measurement as ITimerMeasurement).startDate
        : measurement.dateTime
    ),
    "u-LL-dd"
  );
}
