import { IMetricOverviewPropertyDefinition, IMetricType } from "./IMetricType";
import { IDataTableColumnDefinition } from "../components/details/dataTable/IDataTableColumnDefinition";
import { MetricType } from "../serverApi/MetricType";
import React from "react";
import { TextSnippetOutlined } from "@mui/icons-material";

export class NotesMetricType implements IMetricType {
  type: MetricType;

  getIcon(): React.ReactNode {
    return <TextSnippetOutlined />;
  }

  getMeasurementsListColumns(): IDataTableColumnDefinition[] {
    return [];
  }

  getOverviewProperties(): IMetricOverviewPropertyDefinition[] {
    return [];
  }

  getYAxisLabel(): string {
    return "";
  }
}
