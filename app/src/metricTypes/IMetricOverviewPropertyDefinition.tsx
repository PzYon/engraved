import React from "react";

export interface IMetricOverviewPropertyDefinition {
  node: React.ReactNode;
  label: string;
  key: string;
  hideWhen?: () => boolean;
}
