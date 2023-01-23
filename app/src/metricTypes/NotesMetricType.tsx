import { IMetricOverviewPropertyDefinition, IMetricType } from "./IMetricType";
import { IMeasurementsTableColumnDefinition } from "../components/details/measurementsTable/IMeasurementsTableColumnDefinition";
import { MetricType } from "../serverApi/MetricType";
import React from "react";
import { TextSnippetOutlined } from "@mui/icons-material";

export class NotesMetricType implements IMetricType {
  type: MetricType;

  getIcon(): React.ReactNode {
    return <TextSnippetOutlined style={{ backgroundColor: "#DFEEFF" }} />;
  }

  getMeasurementsListColumns(): IMeasurementsTableColumnDefinition[] {
    return [];
  }

  getOverviewProperties(): IMetricOverviewPropertyDefinition[] {
    return [];
  }

  getYAxisLabel(): string {
    return "";
  }

  getValue(): number {
    return 0;
  }
}
