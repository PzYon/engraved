import { FormElementContainer } from "../../common/FormUtils";
import { DateSelector } from "../../common/DateSelector";
import React, { useEffect, useMemo } from "react";
import { Typography } from "@mui/material";
import { FormatDuration } from "../../common/FormatDuration";

export const UpsertTimerEntry: React.FC<{
  startDate: string;
  setStartDate: (startDate: Date) => void;
  endDate: string;
  setEndDate: (endDate: Date) => void;
}> = ({ setStartDate, startDate, setEndDate, endDate }) => {
  const start = useMemo(() => {
    return startDate ? new Date(startDate) : undefined;
  }, [startDate]);

  const end = useMemo(() => {
    return endDate ? new Date(endDate) : undefined;
  }, [endDate]);

  useEffect(() => {
    if (start && !end) {
      setEndDate(new Date());
    }
  }, [end, setEndDate, start]);

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
