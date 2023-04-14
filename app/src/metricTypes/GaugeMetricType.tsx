import { MetricType } from "../serverApi/MetricType";
import { BarChartSharp } from "@mui/icons-material";
import { IMetricType } from "./IMetricType";
import { IGaugeMeasurement } from "../serverApi/ITimerMeasurement";
import { IMeasurement } from "../serverApi/IMeasurement";
import { IMeasurementsTableColumnDefinition } from "../components/details/measurementsTable/IMeasurementsTableColumnDefinition";
import { getValue } from "../components/details/chart/consolidation/consolidate";
import { IMeasurementsTableGroup } from "../components/details/measurementsTable/IMeasurementsTableGroup";
import { IMetric } from "../serverApi/IMetric";
import React from "react";
import { Activity } from "./Activity";
import { AttributeValues } from "../components/common/AttributeValues";

export class GaugeMetricType implements IMetricType {
  type = MetricType.Gauge;

  isGroupable = true;

  getIcon() {
    return <BarChartSharp style={{ backgroundColor: "FFFFDF" }} />;
  }

  getActivity(metric: IMetric, measurement: IMeasurement): React.ReactNode {
    return (
      <Activity metric={metric} measurement={measurement}>
        {(measurement as IGaugeMeasurement).value}
        <AttributeValues
          attributes={metric.attributes}
          attributeValues={measurement.metricAttributeValues}
        />
      </Activity>
    );
  }

  getMeasurementsTableColumns(): IMeasurementsTableColumnDefinition[] {
    return [
      {
        key: "_value",
        getHeaderReactNode: () => "Value",
        isSummable: true,
        getRawValue: (measurement: IMeasurement) => getValue(measurement),
        getValueReactNode: (
          _: IMeasurementsTableGroup,
          measurement: IMeasurement
        ) => getValue(measurement),
        getGroupReactNode: (group) => group.totalString,
      },
    ];
  }

  getValue(measurement: IMeasurement): number {
    return (measurement as IGaugeMeasurement).value;
  }

  getYAxisLabel(): string {
    return "Unit [todo]";
  }
}
