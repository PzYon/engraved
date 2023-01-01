import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TextField } from "@mui/material";
import React from "react";
import { stripTime } from "./utils";
import de from "date-fns/locale/de";

export const DateSelector: React.FC<{
  setDate: (date: Date) => void;
  date: Date;
  label?: string;
}> = ({ setDate, date, label }) => {
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
    </LocalizationProvider>
  );
};
