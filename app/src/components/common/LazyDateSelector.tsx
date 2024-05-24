import { stripTime } from "../../util/utils";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { Button, styled } from "@mui/material";
import React from "react";
import { addMinutes } from "date-fns";
import { IDateSelectorProps } from "./DateSelector";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { de } from "date-fns/locale/de";

const LazyDateSelector: React.FC<IDateSelectorProps> = ({
  setDate,
  date,
  label,
  showTime,
  showClear,
  hasFocus,
}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <FlexContainer>
        <FlexElement>
          <DesktopDatePicker
            sx={{ width: "100%" }}
            autoFocus={hasFocus}
            label={label}
            value={date || null}
            showDaysOutsideCurrentMonth={true}
            onChange={(d) => {
              setDate(stripTime(d));
            }}
          />
        </FlexElement>
        {showTime ? (
          <FlexElement>
            <TimePicker
              ampm={false}
              format="HH:mm:ss"
              views={["hours", "minutes"]}
              value={date || null}
              onChange={setDate}
            />
            <ButtonContainer>
              <Button
                variant="text"
                sx={{ fontSize: "small" }}
                onClick={() => setDate(addMinutes(date, -5))}
              >
                -5min
              </Button>
              <Button
                variant="text"
                sx={{ fontSize: "small" }}
                onClick={() => setDate(addMinutes(date, 5))}
              >
                +5min
              </Button>
              {showClear ? (
                <Button
                  variant="text"
                  sx={{ fontSize: "small" }}
                  onClick={() => setDate(null)}
                >
                  Clear
                </Button>
              ) : null}
            </ButtonContainer>
          </FlexElement>
        ) : null}
      </FlexContainer>
    </LocalizationProvider>
  );
};

const FlexContainer = styled("div")`
  display: flex;
  gap: ${(p) => p.theme.spacing(1)};
`;

const FlexElement = styled("div")`
  flex-grow: 1;
  min-width: 100px;
  width: 100%;
`;

const ButtonContainer = styled("div")`
  display: flex;
  justify-content: end;
`;

export default LazyDateSelector;
