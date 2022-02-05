import React from "react";
import { IMeasurement } from "../serverApi/IMeasurement";
import { DataGrid } from "./dataGrid/DataGrid";

export const MeasurementsList: React.FC<{ measurements: IMeasurement[] }> = ({
  measurements,
}) => {
  return <DataGrid measurements={measurements} />;
};
