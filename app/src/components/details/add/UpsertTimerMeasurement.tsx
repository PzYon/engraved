import { FormElementContainer } from "../../common/FormUtils";
import { DateSelector } from "../../common/DateSelector";
import React, { useEffect } from "react";
import { TimerMetricType } from "../../../metricTypes/TimerMetricType";
import { Typography } from "@mui/material";

export const UpsertTimerMeasurement: React.FC<{
  startDate: string;
  setStartDate: (startDate: Date) => void;
  endDate: string;
  setEndDate: (endDate: Date) => void;
}> = ({ setStartDate, startDate, setEndDate, endDate }) => {
  const start = startDate ? new Date(startDate) : undefined;
  const end = endDate ? new Date(endDate) : undefined;

  useEffect(() => {
    if (start && !end) {
      setEndDate(new Date());
    }
  }, []);

  return (
    <>
      <FormElementContainer>
        <DateSelector
          label={"Start date"}
          date={start}
          setDate={setStartDate}
          showTime={true}
        />
      </FormElementContainer>
      <FormElementContainer>
        <DateSelector
          label={"End date"}
          date={end}
          setDate={setEndDate}
          showTime={true}
        />
      </FormElementContainer>
      <FormElementContainer>
        <Typography fontSize="small">
          Duration:{" "}
          {TimerMetricType.getDuration(start?.toString(), end?.toString())}
        </Typography>
      </FormElementContainer>
    </>
  );
};
