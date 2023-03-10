import { FormElementContainer } from "../../common/FormUtils";
import { DateSelector } from "../../common/DateSelector";
import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { FormatDuration } from "../../common/FormatDuration";

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
          showClear={true}
        />
      </FormElementContainer>
      <FormElementContainer>
        <Typography fontSize="small">
          Duration: <FormatDuration start={start} end={end} />
        </Typography>
      </FormElementContainer>
    </>
  );
};
