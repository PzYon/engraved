import React from "react";

export interface IPropertyDefinition {
  node: () => React.ReactNode;
  label: string;
  key: string;
  hideWhen?: () => boolean;
  highlightStyle?: () => "regular" | "warning";
}
