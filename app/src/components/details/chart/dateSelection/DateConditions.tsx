import React from "react";
import { DateTimeSelector } from "../../../common/DateTimeSelector";
import { useMetricDetailsContext } from "../../MetricDetailsContext";

export const DateConditions: React.FC = () => {
  const { dateConditions, setDateConditions } = useMetricDetailsContext();

  return (
    <>
      <DateTimeSelector
        label="From"
        date={dateConditions.from}
        setDate={(d) => {
          setDateConditions({ ...dateConditions, from: d });
        }}
      />
      <DateTimeSelector
        label="To"
        date={dateConditions.to}
        setDate={(d) => {
          setDateConditions({ ...dateConditions, to: d });
        }}
      />
    </>
  );
};
