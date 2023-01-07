import { IMetricOverviewPropertyDefinition, IMetricType } from "./IMetricType";
import { IMeasurementsListColumnDefinition } from "../components/details/dataTable/IMeasurementsListColumnDefinition";
import { MetricType } from "../serverApi/MetricType";
import React from "react";
import { TextSnippetOutlined } from "@mui/icons-material";

export class NotesMetricType implements IMetricType {
  type: MetricType;

  getIcon(): React.ReactNode {
    return <TextSnippetOutlined />;
  }

  getMeasurementsListColumns(): IMeasurementsListColumnDefinition[] {
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
