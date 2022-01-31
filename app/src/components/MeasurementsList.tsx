import React from "react";
import { IMeasurement } from "../serverApi/IMeasurement";

export const MeasurementsList: React.FC<{ measurements: IMeasurement[] }> = ({
  measurements,
}) => {
  return (
    <ul>
      {measurements.map((m) => (
        <li key={m.dateTime}>
          {m.dateTime}: {m.value}
        </li>
      ))}
    </ul>
  );
};
