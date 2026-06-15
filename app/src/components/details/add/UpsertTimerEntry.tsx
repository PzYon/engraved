import { FormElementContainer } from "../../common/FormUtils";
import { DateSelector } from "../../common/DateSelector";
import React, { useEffect } from "react";
import { Stack, styled, Typography } from "@mui/material";
import { FormatDuration } from "../../common/FormatDuration";

export const UpsertTimerEntry: React.FC<{
  startDate: string | undefined;
  setStartDate: (startDate: Date | null) => void;
  endDate: string | undefined;
  setEndDate: (endDate: Date | null) => void;
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
        <Typography>
          <Stack
            direction="column"
            spacing={1}
            useFlexGap
            sx={{ flexWrap: "wrap", fontSize: "small" }}
          >
            <span>Duration</span>
            <div>
              <Pill>
                <FormatDuration
                  start={start ?? new Date()}
                  end={end ?? new Date()}
                />
              </Pill>
            </div>
          </Stack>
        </Typography>
      </FormElementContainer>
    </>
  );
};

const Pill = styled("span")`
  padding: 3px 11px;
  border-radius: 13px;
  font-size: small;
  background-color: ${(p) => p.theme.palette.primary.main};
  color: ${(p) => p.theme.palette.common.white};
`;
