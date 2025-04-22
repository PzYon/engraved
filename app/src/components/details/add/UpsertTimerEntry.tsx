import { FormElementContainer } from "../../common/FormUtils";
import { DateSelector } from "../../common/DateSelector";
import React, { useEffect } from "react";
import { styled, Typography } from "@mui/material";
import { FormatDuration } from "../../common/FormatDuration";

export const UpsertTimerEntry: React.FC<{
  startDate: string;
  setStartDate: (startDate: Date) => void;
  endDate: string;
  setEndDate: (endDate: Date) => void;
}> = ({ setStartDate, startDate, setEndDate, endDate }) => {
  const start = startDate ? new Date(startDate) : undefined;
  const end = endDate ? new Date(endDate) : undefined;

  useEffect(() => {
    if (!start) {
      setStartDate(new Date());
    } else if (!end) {
      setEndDate(new Date());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          Duration
          <Pill>
            <FormatDuration start={start} end={end} />
          </Pill>
        </Typography>
      </FormElementContainer>
    </>
  );
};

const Pill = styled("span")`
  margin-left: 10px;
  padding: 3px 8px;
  border-radius: 12px;
  background-color: ${(p) => p.theme.palette.primary.main};
  color: ${(p) => p.theme.palette.common.white};
`;
