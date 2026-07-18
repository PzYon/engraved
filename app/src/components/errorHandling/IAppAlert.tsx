import React from "react";

export interface IAppAlert {
  message?: React.ReactNode;
  title: string;
  type: "success" | "info" | "warning" | "error";
  hideDurationSec?: number;
  relatedEntityId?: string;
}
