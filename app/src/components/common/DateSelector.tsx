import {
  DesktopDatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import React from "react";
import { stripTime } from "./utils";
import de from "date-fns/locale/de";

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
        <TimePicker
          ampm={false}
          inputFormat="HH:mm:ss"
          mask="__:__:__"
          views={["hours", "minutes", "seconds"]}
          value={date}
          onChange={setDate}
          renderInput={(params) => <TextField {...params} />}
        />
      ) : null}
    </LocalizationProvider>
  );
};
