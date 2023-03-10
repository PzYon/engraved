import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Button } from "@mui/material";
import React from "react";
import { stripTime } from "../../util/utils";
import de from "date-fns/locale/de";
import { addMinutes } from "date-fns";

export const DateSelector: React.FC<{
  setDate: (date: Date) => void;
  date: Date;
  label?: string;
  showTime?: boolean;
  showClear?: boolean;
}> = ({ setDate, date, label, showTime, showClear }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <DesktopDatePicker
        label={label}
        value={date || null}
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
