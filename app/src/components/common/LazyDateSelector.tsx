import { stripTime } from "../../util/utils";
import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { Button } from "@mui/material";
import React from "react";
import { addMinutes } from "date-fns";
import { IDateSelectorProps } from "./DateSelector";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import de from "date-fns/locale/de";

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
      <DesktopDatePicker
        autoFocus={hasFocus}
        label={label}
        value={date || null}
        showDaysOutsideCurrentMonth={true}
        onChange={(d) => {
          setDate(stripTime(d));
        }}
      />
      {showTime ? (
        <>
          <TimePicker
            ampm={false}
            format="HH:mm:ss"
            views={["hours", "minutes"]}
            value={date || null}
            onChange={setDate}
          />
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
        </>
      ) : null}
    </LocalizationProvider>
  );
};

export default LazyDateSelector;
