import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Button, TextField } from "@mui/material";
import React from "react";
import { stripTime } from "../../util/utils";
import de from "date-fns/locale/de";
import { addMinutes } from "date-fns";

export const DateSelector: React.FC<{
  setDate: (date: Date) => void;
  date: Date;
  label?: string;
  showTime?: boolean;
}> = ({ setDate, date, label, showTime }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
      <DesktopDatePicker
        label={label}
        renderInput={(params) => <TextField {...params} />}
        value={date}
        onChange={(d) => {
          setDate(stripTime(d));
        }}
      />
      {showTime ? (
        <>
          <TimePicker
            ampm={false}
            inputFormat="HH:mm:ss"
            mask="__:__:__"
            views={["hours", "minutes"]}
            value={date}
            onChange={setDate}
            renderInput={(params) => <TextField {...params} />}
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
        </>
      ) : null}
    </LocalizationProvider>
  );
};
