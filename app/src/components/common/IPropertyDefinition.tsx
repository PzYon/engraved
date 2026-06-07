import React from "react";

export interface IPropertyDefinition {
  node: () => React.ReactNode;
  label: string | null;
  key: string;
  hideWhen?: () => boolean;
  highlightStyle?: () => "red" | "yellow" | "green" | "transparent";
}
