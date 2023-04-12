import { MetricType } from "../serverApi/MetricType";
import { PlusOneSharp } from "@mui/icons-material";
import { IMetricType } from "./IMetricType";
import { IMeasurementsTableColumnDefinition } from "../components/details/measurementsTable/IMeasurementsTableColumnDefinition";
import { IMetric } from "../serverApi/IMetric";
import { IMeasurement } from "../serverApi/IMeasurement";
import React from "react";
import { CounterMeasurementActivity } from "./activities/CounterMeasurementActivity";

// consider: introducing generics here

export class CounterMetricType implements IMetricType {
  type = MetricType.Counter;

  isGroupable = true;

  getIcon() {
    return <PlusOneSharp style={{ backgroundColor: "#DFFFE3" }} />;
  }

  getActivity(metric: IMetric, measurement: IMeasurement): React.ReactNode {
    return (
      <CounterMeasurementActivity metric={metric} measurement={measurement} />
    );
  }

  getMeasurementsTableColumns(): IMeasurementsTableColumnDefinition[] {
    return [];
  }

  getYAxisLabel(): string {
    return "Count";
  }

  getValue(): number {
    return 1;
  }
}
