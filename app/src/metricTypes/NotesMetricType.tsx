import { IMetricType } from "./IMetricType";
import { IMeasurementsTableColumnDefinition } from "../components/details/measurementsTable/IMeasurementsTableColumnDefinition";
import { MetricType } from "../serverApi/MetricType";
import React from "react";
import { TextSnippetOutlined } from "@mui/icons-material";

export class NotesMetricType implements IMetricType {
  type: MetricType;

  getIcon(): React.ReactNode {
    return <TextSnippetOutlined style={{ backgroundColor: "#DFEEFF" }} />;
  }

  getMeasurementsTableColumns(): IMeasurementsTableColumnDefinition[] {
    throw new Error(
      "getMeasurementsTableColumns is currently not supported for Notes."
    );
  }

  getValue(): number {
    throw new Error("getValue is currently not supported for Notes.");
  }

  getYAxisLabel(): string {
    throw new Error("getYAxisLabel is currently not supported for Notes.");
  }
}
